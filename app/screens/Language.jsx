import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('language'),
          headerBackTitle: t('back')
        }} 
      />
      
      <Text style={styles.title}>{t('selectLanguage')}</Text>
      
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={() => changeLanguage('en')}
      >
        <Text style={styles.languageText}>English</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={() => changeLanguage('es')}
      >
        <Text style={styles.languageText}>Español</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={() => changeLanguage('fr')}
      >
        <Text style={styles.languageText}>Français</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
  },
});