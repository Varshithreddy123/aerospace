import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'Hindi' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'mr', name: 'Marathi' },
  { id: 'ru', name: 'Russian' },
];

const Read = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Default to English
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample text content that will be "translated"
  const originalContent = "This is the content that will be displayed in the selected language.";

  const filteredLanguages = languages.filter(language => 
    language.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  // This function simulates translation - in a real app, you'd use a translation API
  const getTranslatedContent = () => {
    // In a real app, you would integrate with a translation service here
    switch(selectedLanguage.id) {
      case 'en':
        return originalContent;
      case 'hi':
        return "यह वह सामग्री है जो चयनित भाषा में प्रदर्शित की जाएगी।";
      case 'fr':
        return "Ceci est le contenu qui sera affiché dans la langue sélectionnée.";
      case 'de':
        return "Dies ist der Inhalt, der in der ausgewählten Sprache angezeigt wird.";
      case 'mr':
        return "ही ती सामग्री आहे जी निवडलेल्या भाषेत प्रदर्शित केली जाईल.";
      case 'ru':
        return "Это контент, который будет отображаться на выбранном языке.";
      default:
        return originalContent;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Read</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.content}>
          {getTranslatedContent()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.languageSelector} 
        onPress={() => setShowLanguageModal(true)}
      >
        <Text style={styles.languageSelectorText}>
          {selectedLanguage ? selectedLanguage.name : 'Select language'}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>language</Text>
            
            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Language..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Feather name="settings" size={18} color="#666" />
            </View>
            
            <ScrollView style={styles.languageList}>
              {filteredLanguages.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  style={styles.languageItem}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      selectedLanguage?.id === language.id && styles.radioOuterSelected
                    ]}>
                      {selectedLanguage?.id === language.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text style={styles.languageText}>{language.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.okButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  languageSelectorText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#999',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    margin: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  radioContainer: {
    marginRight: 12,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#2089dc',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2089dc',
  },
  languageText: {
    fontSize: 16,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
    alignItems: 'flex-end',
  },
  okButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#2089dc',
  },
  okButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default Read;