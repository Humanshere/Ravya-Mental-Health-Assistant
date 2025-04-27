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
      <Text style={styles.mainTitle}>Mental Health App</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#323232',
    marginLeft: 16,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#323232',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '80%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#323232',
  },
  navBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
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
  },
  navButtonText: {
    fontSize: 14,
    color: '#323232',
  },
});

export default App;