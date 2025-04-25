import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  FlatList,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ServiceRequests = () => {
  // State for requests
  const [requests, setRequests] = useState([]);
  
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(new Date());
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState([]);
  
  // State for calendar modal
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeDateInput, setActiveDateInput] = useState(null); // 'start' or 'end'

  // Filter status options
  const statusOptions = [
    'Accepted', 
    'In Progress', 
    'Canceled', 
    'Completed', 
    'Out of Service', 
    'Rescheduled', 
    'Placed', 
    'Paid', 
    'On Hold'
  ];

  // Toggle status selection
  const toggleStatus = (status) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter(item => item !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Here you would filter the requests based on the selected criteria
    console.log('Filters applied', {
      startDate: filterStartDate,
      endDate: filterEndDate,
      statuses: filterStatus
    });
    
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterStartDate(new Date());
    setFilterEndDate(new Date());
    setFilterStatus([]);
  };

  // Format date to string (dd/mm/yyyy)
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Open calendar for date selection
  const openCalendar = (type) => {
    setActiveDateInput(type);
    setSelectedMonth(type === 'start' ? filterStartDate : filterEndDate);
    setSelectedDate(type === 'start' ? filterStartDate : filterEndDate);
    setShowCalendar(true);
  };

  // Apply selected date
  const applySelectedDate = () => {
    if (selectedDate) {
      if (activeDateInput === 'start') {
        setFilterStartDate(selectedDate);
      } else if (activeDateInput === 'end') {
        setFilterEndDate(selectedDate);
      }
    }
    setShowCalendar(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // In JavaScript, getDay() returns 0 for Sunday, so we adjust to start week on Monday
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Calculate days for the calendar grid (6 rows x 7 columns)
    for (let i = 0; i < 42; i++) {
      if (i >= startingDay && i < startingDay + daysInMonth) {
        days.push(i - startingDay + 1);
      } else {
        days.push(null);
      }
    }
    
    return days;
  };

  // Render calendar day
  const renderCalendarDay = (day, index) => {
    if (day === null) {
      return <View key={index} style={styles.calendarDayEmpty} />;
    }
    
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const isSelected = selectedDate && 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
      
    return (
      <TouchableOpacity
        key={index}
        style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render weekday headers
  const renderWeekdayHeaders = () => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekdays.map((day, index) => (
      <View key={index} style={styles.calendarWeekday}>
        <Text style={styles.calendarWeekdayText}>{day}</Text>
      </View>
    ));
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  // Enhanced empty state to match the image
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyStateContainer}>
          <View style={styles.topIconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="map-outline" size={24} color="gray" />
            </View>
          </View>
          
          <View style={styles.iconsRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="rocket-outline" size={24} color="gray" />
            </View>
            
            <View style={styles.boxContainer}>
              <View style={styles.box} />
            </View>
            
            <View style={styles.iconCircle}>
              <Ionicons name="school-outline" size={24} color="gray" />
            </View>
          </View>
          
          <Text style={styles.emptyText}>No request found</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Service Requests</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search and Filter Bar */}
      <View style={styles.searchFilterBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#0080FF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for area, services..."
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      {/* Empty State or Request List */}
      {requests.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      
      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.filterModal, { maxHeight: height * 0.8 }]}>
            <Text style={styles.filterTitle}>Filters</Text>
            
            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Select date</Text>
              <TouchableOpacity style={styles.clearAllButton} onPress={() => clearFilters()}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>From</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => openCalendar('start')}
                >
                  <Text>{formatDate(filterStartDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>To</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => openCalendar('end')}
                >
                  <Text>{formatDate(filterEndDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Status Selection */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Select status of request</Text>
            </View>
            
            <View style={styles.statusOptionsContainer}>
              {statusOptions.map((status, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.statusCheckboxContainer}
                  onPress={() => toggleStatus(status)}
                >
                  <View style={[
                    styles.checkbox, 
                    filterStatus.includes(status) && styles.checkboxSelected
                  ]}>
                    {filterStatus.includes(status) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.statusLabel}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Action Buttons */}
            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModal, { width: width * 0.9 }]}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
              <View style={styles.calendarControls}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                  <Ionicons name="chevron-back" size={24} color="#0066CC" />
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextMonth}>
                  <Ionicons name="chevron-forward" size={24} color="#0066CC" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.calendarGrid}>
              {renderWeekdayHeaders()}
              {generateCalendarDays().map((day, index) => renderCalendarDay(day, index))}
            </View>
            
            <View style={styles.calendarActions}>
              <TouchableOpacity 
                style={styles.calendarClearButton}
                onPress={() => {
                  setSelectedDate(null);
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.calendarClearText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.calendarApplyButton}
                onPress={applySelectedDate}
              >
                <Text style={styles.calendarApplyText}>Apply</Text>
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchFilterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 100, // Adjust based on your needs
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topIconContainer: {
    position: 'absolute',
    top: '-5%',
    zIndex: 1,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: -50,
  },
  boxContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -40,
    transform: [{translateY: 6}],
  },
  box: {
    width: 100,
    height: 90,
    backgroundColor: '#FFC107',
    borderRadius: 4,
    transform: [
      { perspective: 800 },
      { rotateX: '20deg' },
      { rotateZ: '0deg' }
    ],
    borderBottomWidth: 20,
    borderBottomColor: '#E6A800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 32,
    fontWeight: '500',
  },
  requestItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  clearAllButton: {},
  clearAllText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputContainer: {
    width: '48%',
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statusCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  statusLabel: {
    fontSize: 14,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#0066CC',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  calendarModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarControls: {
    flexDirection: 'row',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarWeekday: {
    width: '14.28%',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  calendarWeekdayText: {
    fontWeight: '600',
    color: '#666',
    fontSize: 12,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: {
    fontSize: 14,
  },
  calendarDaySelected: {
    backgroundColor: '#0066CC',
    borderRadius: 20,
  },
  calendarDayTextSelected: {
    color: 'white',
  },
  calendarDayEmpty: {
    width: '14.28%',
    aspectRatio: 1,
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarClearButton: {
    padding: 12,
    alignItems: 'center',
  },
  calendarClearText: {
    color: '#666',
    fontWeight: '500',
  },
  calendarApplyButton: {
    padding: 12,
    alignItems: 'center',
  },
  calendarApplyText: {
    color: '#0066CC',
    fontWeight: '500',
  },
});

export default ServiceRequests;