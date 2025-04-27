// App.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { COLORS } from './components/Colors';

// Import our components
import Chat from './components/Chat';
import JournalApp from './components/JournalApp';

const App = () => {
  // State to track which section is active
  // 'main' represents the main screen
  const [activeSection, setActiveSection] = useState('main');

  // Main screen component
  const MainScreen = () => (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>RAVYA</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => setActiveSection('chat')}
        >
          <Image 
            source={require('./components/assets/icons/robot.png')} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => setActiveSection('journal')}
        >
          <Image 
            source={require('./components/assets/icons/journal.png')} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Journal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Header with back button
  const Header = ({ title }) => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setActiveSection('main')}
      >
        <Image 
          source={require('./components/assets/icons/back-arrow.png')} 
          style={styles.backIcon} 
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  // Toggle between sections
  const renderContent = () => {
    switch (activeSection) {
      case 'main':
        return <MainScreen />;
      case 'chat':
        return (
          <View style={styles.screenContainer}>
            <Header title="Chat" />
            <Chat />
          </View>
        );
      case 'journal':
        return (
          <View style={styles.screenContainer}>
            <Header title="Journal" />
            <JournalApp />
          </View>
        );
      default:
        return <MainScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Content Area */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {/* Navigation Bar - Only show on main screen */}
      {activeSection === 'main' && (
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setActiveSection('chat')}
          >
            <Image 
              source={require('./components/assets/icons/robot.png')} 
              style={styles.navIcon} 
            />
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setActiveSection('journal')}
          >
            <Image 
              source={require('./components/assets/icons/journal.png')} 
              style={styles.navIcon} 
            />
            <Text style={styles.navButtonText}>Journal</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// Updated styles for App.js
// Import the COLORS from the colors file


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.textLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 16,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '80%',
    elevation: 4,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  buttonIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
    tintColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  navBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    elevation: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: COLORS.primary,
  },
  navButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});

export default App;