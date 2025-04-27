// JournalApp.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  Modal,
  StatusBar,
  ActivityIndicator,
  Share,
  Animated,
  Easing,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { COLORS } from './Colors';


const STORAGE_KEY = 'journalEntries';
const DRAFT_KEY = 'journalDraft';
const AUTO_SAVE_INTERVAL = 5000; // Auto-save every 5 seconds

// Enhanced Material Design Green Theme Colors


const JournalApp = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftEntryExists, setDraftEntryExists] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const autoSaveTimerRef = useRef(null);
  const lastSavedContentRef = useRef('');
  const lastSavedTitleRef = useRef('');

  // Load entries when app starts
  useEffect(() => {
    const initializeApp = async () => {
      await loadEntries();
      await loadDraft();
      setIsLoading(false);
      
      // Animate entries appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
    };
    
    initializeApp();
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Set up auto-save for current entry
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setInterval(() => {
      const contentChanged = currentEntry !== lastSavedContentRef.current;
      const titleChanged = currentTitle !== lastSavedTitleRef.current;
      
      if ((contentChanged || titleChanged) && currentEntry.trim() !== '') {
        saveDraft();
      }
    }, AUTO_SAVE_INTERVAL);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [currentEntry, currentTitle]);

  // Save draft to prevent data loss
  const saveDraft = async () => {
    try {
      const draft = {
        title: currentTitle,
        content: currentEntry,
        editingId: editingId,
        timestamp: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      lastSavedContentRef.current = currentEntry;
      lastSavedTitleRef.current = currentTitle;
      setDraftEntryExists(true);
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  // Load draft if exists
  const loadDraft = async () => {
    try {
      const draftData = await AsyncStorage.getItem(DRAFT_KEY);
      if (draftData) {
        const draft = JSON.parse(draftData);
        setCurrentTitle(draft.title || '');
        setCurrentEntry(draft.content || '');
        setEditingId(draft.editingId);
        lastSavedContentRef.current = draft.content || '';
        lastSavedTitleRef.current = draft.title || '';
        setDraftEntryExists(true);
        console.log('Draft loaded successfully');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  // Clear draft - FIXED
  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
      lastSavedContentRef.current = '';
      lastSavedTitleRef.current = '';
      setDraftEntryExists(false);
      console.log('Draft cleared successfully');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  // Save entries to AsyncStorage with error handling
  const saveEntries = async (updatedEntries) => {
    setIsSaving(true);
    try {
      const entriesJSON = JSON.stringify(updatedEntries);
      await AsyncStorage.setItem(STORAGE_KEY, entriesJSON);
      console.log('Entries saved successfully');
    } catch (error) {
      Alert.alert(
        'Save Error',
        'Failed to save entries. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Load entries from AsyncStorage with error handling
  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedEntries !== null) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
        console.log(`Loaded ${parsedEntries.length} entries`);
      } else {
        // Initialize with empty array if no entries found
        setEntries([]);
        console.log('No saved entries found, initialized with empty array');
      }
    } catch (error) {
      Alert.alert(
        'Load Error',
        'Failed to load your journal entries. Please restart the app.',
        [{ text: 'OK' }]
      );
      console.error('Load error:', error);
      // Initialize with empty array in case of error
      setEntries([]);
    }
  };

  // Export all entries to share/backup
  const exportEntries = async () => {
    try {
      const entriesJSON = JSON.stringify(entries, null, 2);
      const result = await Share.share({
        message: entriesJSON,
        title: 'Journal Entries Backup'
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Your journal entries were successfully exported');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export your journal entries');
      console.error('Export error:', error);
    }
  };

  // Add or update an entry
  const saveEntry = () => {
    if (currentEntry.trim() === '') {
      Alert.alert('Error', 'Journal entry cannot be empty');
      return;
    }

    const title = currentTitle.trim() === '' 
      ? format(new Date(), 'MMM dd, yyyy') 
      : currentTitle;

    if (editingId !== null) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === editingId 
          ? { ...entry, title, content: currentEntry, updatedAt: new Date().toISOString() }
          : entry
      );
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
    } else {
      // Create new entry
      const newEntry = {
        id: Date.now().toString(),
        title,
        content: currentEntry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
    }

    // Reset form and clear draft
    setCurrentEntry('');
    setCurrentTitle('');
    setEditingId(null);
    clearDraft();
  };

  // Delete an entry - FIXED
  const deleteEntry = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { 
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              console.log(`Deleting entry with id: ${id}`);
              // Filter out the entry with the given id
              const updatedEntries = entries.filter(entry => entry.id !== id);
              
              // Update state
              setEntries(updatedEntries);
              
              // Save to storage
              await saveEntries(updatedEntries);
              
              // If we're editing this entry, clear the form
              if (editingId === id) {
                setCurrentEntry('');
                setCurrentTitle('');
                setEditingId(null);
                await clearDraft();
              }
              
              // If we're viewing this entry, close the modal
              if (viewingEntry && viewingEntry.id === id) {
                setModalVisible(false);
              }
              
              Alert.alert('Success', 'Entry deleted successfully');
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Edit an entry
  const editEntry = (entry) => {
    setCurrentTitle(entry.title);
    setCurrentEntry(entry.content);
    setEditingId(entry.id);
    saveDraft(); // Save as draft immediately
  };

  // View full entry
  const viewEntry = (entry) => {
    setViewingEntry(entry);
    setModalVisible(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy h:mm a');
  };

  // Format date for entry cards - more compact
  const formatCardDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  // Discard current draft - FIXED
  const discardDraft = () => {
    Alert.alert(
      'Discard Draft',
      'Are you sure you want to discard your unsaved changes?',
      [
        { 
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Discard', 
          onPress: async () => {
            try {
              console.log('Discarding draft');
              setCurrentEntry('');
              setCurrentTitle('');
              setEditingId(null);
              await clearDraft();
              Alert.alert('Success', 'Draft discarded');
            } catch (error) {
              console.error('Error discarding draft:', error);
              Alert.alert('Error', 'Failed to discard draft');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Render loading state with animation
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>My Journal</Text>
          <TouchableOpacity style={styles.exportButton} onPress={exportEntries}>
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Entry Form */}
      <View style={styles.formContainer}>
        {draftEntryExists && (
          <View style={styles.draftIndicator}>
            <Text style={styles.draftText}>✓ Draft autosaved</Text>
          </View>
        )}
        <TextInput
          style={styles.titleInput}
          placeholder="Entry Title (optional)"
          value={currentTitle}
          onChangeText={setCurrentTitle}
          placeholderTextColor={COLORS.textSecondary}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Write your thoughts here..."
          value={currentEntry}
          onChangeText={setCurrentEntry}
          multiline
          placeholderTextColor={COLORS.textSecondary}
          textAlignVertical="top"
        />
        <View style={styles.buttonRow}>
          {currentEntry.trim() !== '' && (
            <TouchableOpacity 
              style={styles.discardButton} 
              onPress={discardDraft}
              activeOpacity={0.7}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.savingButton]} 
            onPress={saveEntry}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingId !== null ? 'Update Entry' : 'Save Entry'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Journal Entries List */}
      <Animated.View 
        style={[
          styles.entriesContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.entriesHeader}>Previous Entries</Text>
        {entries.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.noEntries}>No entries yet. Start journaling!</Text>
            <Text style={styles.noEntriesSubtext}>Your thoughts are waiting to be captured.</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.entriesList}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={[
                  styles.entryItem,
                  index % 3 === 0 && styles.entryItemAccent1,
                  index % 3 === 1 && styles.entryItemAccent2,
                  index % 3 === 2 && styles.entryItemAccent3,
                ]} 
                onPress={() => viewEntry(item)}
                activeOpacity={0.7}
              >
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.entryDate}>
                    {formatCardDate(item.createdAt)}
                  </Text>
                </View>
                <Text style={styles.entryPreview} numberOfLines={3}>
                  {item.content}
                </Text>
                <View style={styles.entryActions}>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log('Edit button pressed for item:', item.id);
                      editEntry(item);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log('Delete button pressed for item:', item.id);
                      deleteEntry(item.id);
                    }}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>

      {/* Modal for viewing full entry */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {viewingEntry && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={2}>{viewingEntry.title}</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalDateContainer}>
                <Text style={styles.modalDate}>Created: {formatDate(viewingEntry.createdAt)}</Text>
                {viewingEntry.createdAt !== viewingEntry.updatedAt && (
                  <Text style={styles.modalDate}>Updated: {formatDate(viewingEntry.updatedAt)}</Text>
                )}
              </View>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{viewingEntry.content}</Text>
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.editFromViewButton} 
                  onPress={() => {
                    setModalVisible(false);
                    editEntry(viewingEntry);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editFromViewButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteFromViewButton}
                  onPress={() => {
                    setModalVisible(false);
                    deleteEntry(viewingEntry.id);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteFromViewButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Updated styles for JournalApp.js
// This includes only the major color changes - the full style object is very long
// Import the COLORS from the colors file

// Just the key color changes for the journal component
const journalStyleUpdates = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryVeryLight,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: 32,
    borderRadius: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  draftIndicator: {
    backgroundColor: COLORS.draftYellow,
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftText: {
    color: COLORS.draftText,
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    margin: 16,
    elevation: 3,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  titleInput: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryLight,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 140,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.primaryVeryLight,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  
  // Entry item colors - different accent colors for visual variety
  entryItemAccent1: {
    borderLeftColor: COLORS.primary,
  },
  entryItemAccent2: {
    borderLeftColor: COLORS.secondary,
  },
  entryItemAccent3: {
    borderLeftColor: COLORS.accent,
  },
};

export default JournalApp;

/*
const COLORS = {
  primary: '#43A047',         // Primary Green
  primaryDark: '#2E7D32',     // Dark Green
  primaryLight: '#C8E6C9',    // Light Green
  primaryVeryLight: '#E8F5E9', // Very Light Green for backgrounds
  accent: '#00BFA5',          // Accent Teal
  accentLight: '#B2DFDB',     // Light Accent
  textPrimary: '#212121',     // Primary Text
  textSecondary: '#757575',   // Secondary Text
  textLight: '#FFFFFF',       // Light Text
  divider: '#E0E0E0',         // Divider
  error: '#D32F2F',           // Error Red
  errorLight: '#FFEBEE',      // Light Error Background
  background: '#F5F5F5',      // Background
  surface: '#FFFFFF',         // Surface
  disabled: '#9E9E9E',        // Disabled
  draftYellow: '#FFF8E1',     // Draft yellow background (softer)
  draftText: '#FF8F00',       // Draft text color (more visible)
  cardShadow: 'rgba(0,0,0,0.15)', // Shadow for cards
}*/