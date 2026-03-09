// Patient Timeline JavaScript
class TimelineApp {
  constructor() {
    this.selectedPatient = null;
    this.currentNote = null;
    this.storedNotes = [];
    this.init();
  }

  init() {
    console.log('Patient Timeline initialized');
    this.setupEventListeners();
    this.loadStoredNotes();
    this.loadPatientData();
    this.initializeSearch();
    this.updateConsultationList();
  }

  setupEventListeners() {
    // Consultation items
    const consultationItems = document.querySelectorAll('.consultation-item');
    consultationItems.forEach(item => {
      item.addEventListener('click', (e) => this.selectConsultation(e));
    });

    // Timeline action buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.viewFullNote(e));
    });

    const exportBtns = document.querySelectorAll('.export-btn');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.exportNote(e));
    });

    // Export all button
    const exportAllBtn = document.querySelector('.export-all-btn');
    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => this.exportAllNotes());
    }

    // Emergency View button
    const emergencyViewBtn = document.getElementById('emergencyViewBtn');
    if (emergencyViewBtn) {
      emergencyViewBtn.addEventListener('click', () => this.showEmergencyView());
    }

    // Emergency modal controls
    const emergencyClose = document.getElementById('emergencyClose');
    const emergencyPdfBtn = document.getElementById('emergencyPdfBtn');
    const emergencyShareBtn = document.getElementById('emergencyShareBtn');
    const emergencyModal = document.getElementById('emergencyModal');

    if (emergencyClose) emergencyClose.addEventListener('click', () => this.hideEmergencyView());
    if (emergencyPdfBtn) emergencyPdfBtn.addEventListener('click', () => this.downloadEmergencyPDF());
    if (emergencyShareBtn) emergencyShareBtn.addEventListener('click', () => this.shareSecureLink());
    if (emergencyModal) emergencyModal.addEventListener('click', (e) => {
      if (e.target === emergencyModal) this.hideEmergencyView();
    });

    // Modal controls
    const noteModalClose = document.getElementById('noteModalClose');
    const noteModalCancel = document.getElementById('noteModalCancel');
    const noteModalExport = document.getElementById('noteModalExport');
    const noteModal = document.getElementById('noteModal');

    if (noteModalClose) noteModalClose.addEventListener('click', () => this.hideNoteModal());
    if (noteModalCancel) noteModalCancel.addEventListener('click', () => this.hideNoteModal());
    if (noteModalExport) noteModalExport.addEventListener('click', () => this.exportCurrentNote());
    if (noteModal) noteModal.addEventListener('click', (e) => {
      if (e.target === noteModal) this.hideNoteModal();
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch();
        }
      });
    }

    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // User profile
    const userProfile = document.querySelector('.user-profile img');
    if (userProfile) {
      userProfile.addEventListener('click', () => this.showUserProfile());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  selectConsultation(e) {
    const item = e.currentTarget;
    
    // Remove active class from all items
    document.querySelectorAll('.consultation-item').forEach(i => {
      i.classList.remove('active');
    });
    
    // Add active class to selected item
    item.classList.add('active');
    
    // Get patient data
    const patientName = item.dataset.patientName || item.querySelector('h4').textContent;
    const patientId = item.dataset.patientId || this.generatePatientId(patientName);
    const consultationType = item.querySelector('p').textContent;
    const date = item.querySelector('.date').textContent;
    
    this.selectedPatient = {
      name: patientName,
      id: patientId,
      consultationType: consultationType,
      date: date
    };
    
    // Update timeline header
    this.updateTimelineHeader(patientName);
    
    // Load timeline for selected patient
    this.loadPatientTimeline(patientName);
    
    this.showNotification(`Loaded timeline for ${patientName}`, 'info');
  }

  updateTimelineHeader(patientName) {
    const patientInfo = document.querySelector('.patient-info');
    if (patientInfo) {
      patientInfo.querySelector('h2').textContent = patientName;
      
      // Generate patient ID
      const patientId = this.generatePatientId(patientName);
      patientInfo.querySelector('p').textContent = `Patient ID: ${patientId}`;
    }
  }

  generatePatientId(patientName) {
    // Generate a consistent patient ID based on name
    const hash = this.simpleHash(patientName);
    return `PT-2024-${String(hash).padStart(4, '0').slice(0, 4)}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 10000;
  }

  loadPatientTimeline(patientName) {
    // Load timeline from stored notes for selected patient
    this.updateTimelineWithStoredNotes();
  }

  generateTimelineData(patientName) {
    // Generate mock timeline data based on patient
    const baseEntries = [
      {
        date: 'Dec 24, 2024',
        time: '10:30 AM',
        title: 'Fever & Cough Follow-up',
        summary: 'Patient presents with 3-day history of fever and mild cough. Amoxicillin was discontinued due to allergic reaction.',
        hash: this.generateHash()
      },
      {
        date: 'Dec 20, 2024',
        time: '2:15 PM',
        title: 'Annual Physical Examination',
        summary: 'Complete annual physical performed. Patient in good health with normal vital signs.',
        hash: this.generateHash()
      },
      {
        date: 'Dec 15, 2024',
        time: '11:00 AM',
        title: 'Initial Consultation',
        summary: 'New patient consultation. Comprehensive medical history taken. Baseline vitals recorded.',
        hash: this.generateHash()
      },
      {
        date: 'Nov 28, 2024',
        time: '3:30 PM',
        title: 'Laboratory Results Review',
        summary: 'Reviewed recent blood work results. All values within normal range.',
        hash: this.generateHash()
      },
      {
        date: 'Nov 10, 2024',
        time: '1:45 PM',
        title: 'Medication Review',
        summary: 'Comprehensive medication review conducted. Adjusted dosages based on current symptoms.',
        hash: this.generateHash()
      },
      {
        date: 'Oct 25, 2024',
        time: '4:20 PM',
        title: 'Urgent Care Visit',
        summary: 'Patient presented with acute respiratory symptoms. Immediate evaluation and treatment provided.',
        hash: this.generateHash()
      }
    ];

    return baseEntries;
  }

  generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  updateTimelineEntries(timelineData) {
    const entries = document.querySelectorAll('.timeline-entry');
    
    entries.forEach((entry, index) => {
      if (timelineData[index]) {
        const data = timelineData[index];
        
        // Update node date
        const nodeDate = entry.querySelector('.node-date');
        if (nodeDate) {
          nodeDate.textContent = data.date;
        }
        
        // Update content card
        const title = entry.querySelector('.entry-header h3');
        const summary = entry.querySelector('.entry-summary p');
        const hashId = entry.querySelector('.hash-id');
        const entryTime = entry.querySelector('.entry-time');
        
        if (title) title.textContent = data.title;
        if (summary) summary.textContent = data.summary;
        if (hashId) hashId.textContent = `Hash: ${data.hash}`;
        if (entryTime) entryTime.textContent = data.time;
        
        // Store data for export
        entry.dataset.noteData = JSON.stringify(data);
      }
    });
  }

  animateTimelineEntries() {
    const entries = document.querySelectorAll('.timeline-entry');
    entries.forEach((entry, index) => {
      entry.style.opacity = '0';
      entry.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        entry.style.transition = 'all 0.6s ease';
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  viewFullNote(e) {
    e.stopPropagation();
    const entry = e.target.closest('.timeline-entry');
    const noteData = JSON.parse(entry.dataset.noteData || '{}');
    
    this.currentNote = noteData;
    this.showNoteModal(noteData);
  }

  showNoteModal(noteData) {
    const modal = document.getElementById('noteModal');
    const modalBody = document.querySelector('.modal-body');
    
    if (modal && modalBody) {
      // Update modal content with full note
      this.updateModalContent(noteData);
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  updateModalContent(noteData) {
    // Update modal content with stored note data
    const noteSections = {
      subjective: noteData.subjective || 'Subjective content not available.',
      objective: noteData.objective || 'Objective content not available.',
      assessment: noteData.assessment || 'Assessment content not available.',
      plan: noteData.plan || 'Plan content not available.'
    };
    
    // Update modal sections
    Object.keys(noteSections).forEach(section => {
      const sectionElement = document.querySelector(`.note-section:nth-child(${Object.keys(noteSections).indexOf(section) + 1}) p`);
      if (sectionElement) {
        sectionElement.textContent = noteSections[section];
      }
    });
    
    // Update metadata
    const hashElement = document.querySelector('.meta-value');
    const signedElement = document.querySelectorAll('.meta-value')[1];
    
    if (hashElement) hashElement.textContent = noteData.hash || 'Hash: Not available';
    if (signedElement) signedElement.textContent = `${noteData.date} at ${noteData.time || 'Unknown time'}`;
    
    // Add transcript section if available
    if (noteData.transcript) {
      this.addTranscriptToModal(noteData.transcript);
    }
  }

  addTranscriptToModal(transcript) {
    const modalBody = document.querySelector('.modal-body');
    const existingTranscript = modalBody.querySelector('.transcript-section');
    
    if (existingTranscript) {
      existingTranscript.remove();
    }
    
    const transcriptSection = document.createElement('div');
    transcriptSection.className = 'transcript-section';
    transcriptSection.innerHTML = `
      <h4 style="margin-top: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--color-border); color: var(--color-primary); font-weight: 600;">Original Transcript</h4>
      <p style="font-size: 0.875rem; line-height: 1.6; color: var(--color-text-secondary); font-style: italic; background: var(--color-background); padding: 12px; border-radius: 8px; margin-top: 8px;">${transcript}</p>
    `;
    
    modalBody.appendChild(transcriptSection);
  }

  loadPatientData() {
    // Patient data is now loaded from localStorage in loadStoredNotes()
  }

  hideNoteModal() {
    const modal = document.getElementById('noteModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.currentNote = null;
    }
  }

  exportNote(e) {
    e.stopPropagation();
    const entry = e.target.closest('.timeline-entry');
    const noteData = JSON.parse(entry.dataset.noteData || '{}');
    
    this.exportSingleNote(noteData);
  }

  exportSingleNote(noteData) {
    // Create export content
    const exportContent = this.generateExportContent(noteData);
    
    // Create and download file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_note_${noteData.date.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('Note exported successfully', 'success');
  }

  generateExportContent(noteData) {
    return `
MEDICAL NOTE EXPORT
==================

Patient: ${this.selectedPatient?.name || 'Unknown'}
Date: ${noteData.date}
Time: ${noteData.time}
Title: ${noteData.title}
Hash ID: ${noteData.hash}

SUBJECTIVE
----------
${this.generateSubjectiveContent(noteData.title)}

OBJECTIVE
----------
${this.generateObjectiveContent(noteData.title)}

ASSESSMENT
----------
${this.generateAssessmentContent(noteData.title)}

PLAN
----
${this.generatePlanContent(noteData.title)}

STATUS: Signed - Immutable Record
Exported: ${new Date().toLocaleString()}
    `.trim();
  }

  exportCurrentNote() {
    if (this.currentNote) {
      this.exportSingleNote(this.currentNote);
      this.hideNoteModal();
    }
  }

  exportAllNotes() {
    const entries = document.querySelectorAll('.timeline-entry');
    const allNotes = [];
    
    entries.forEach(entry => {
      const noteData = JSON.parse(entry.dataset.noteData || '{}');
      if (noteData.title) {
        allNotes.push(noteData);
      }
    });
    
    if (allNotes.length === 0) {
      this.showNotification('No notes to export', 'warning');
      return;
    }
    
    // Generate combined export
    let exportContent = `
PATIENT TIMELINE EXPORT
======================

Patient: ${this.selectedPatient?.name || 'Unknown'}
Patient ID: ${document.querySelector('.patient-info p')?.textContent || 'Unknown'}
Export Date: ${new Date().toLocaleString()}
Total Notes: ${allNotes.length}

`;
    
    allNotes.forEach((note, index) => {
      exportContent += `
NOTE ${index + 1}
----------
Date: ${note.date}
Time: ${note.time}
Title: ${note.title}
Hash ID: ${note.hash}

${note.summary}

---`;
    });
    
    // Create and download file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_timeline_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification(`Exported ${allNotes.length} notes successfully`, 'success');
  }

  initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.consultation-item');
    
    items.forEach(item => {
      const name = item.querySelector('h4').textContent.toLowerCase();
      const type = item.querySelector('p').textContent.toLowerCase();
      
      if (name.includes(query) || type.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
      const visibleItems = document.querySelectorAll('.consultation-item:not([style*="display: none"])');
      if (visibleItems.length > 0) {
        visibleItems[0].click();
      } else {
        this.showNotification('No patients found', 'warning');
      }
    }
  }

  loadStoredNotes() {
    try {
      const stored = localStorage.getItem('medledger_signed_notes');
      this.storedNotes = stored ? JSON.parse(stored) : [];
      console.log(`Loaded ${this.storedNotes.length} signed notes from localStorage`);
      
      // Load current patient info
      this.loadCurrentPatient();
      
      // Update timeline with stored notes
      this.updateTimelineWithStoredNotes();
      
    } catch (error) {
      console.error('Error loading stored notes:', error);
      this.storedNotes = [];
    }
  }

  loadCurrentPatient() {
    try {
      const currentPatient = localStorage.getItem('medledger_current_patient');
      if (currentPatient) {
        const patient = JSON.parse(currentPatient);
        this.selectedPatient = patient;
        this.updateTimelineHeader(patient.name);
        console.log('Loaded current patient:', patient);
      }
    } catch (error) {
      console.error('Error loading current patient:', error);
    }
  }

  updateTimelineWithStoredNotes() {
    if (!this.selectedPatient) {
      console.log('No patient selected, using default timeline');
      return;
    }
    
    // Filter notes for current patient
    const patientNotes = this.storedNotes.filter(note => 
      note.patientName === this.selectedPatient.name
    );
    
    console.log(`Found ${patientNotes.length} notes for ${this.selectedPatient.name}`);
    
    // Update timeline entries with stored notes
    this.updateTimelineEntries(patientNotes);
    
    // Animate entries
    this.animateTimelineEntries();
  }

  updateTimelineEntries(notesData) {
    const entries = document.querySelectorAll('.timeline-entry');
    
    // Clear existing entries first
    const timelineContent = document.querySelector('.timeline-entries');
    if (timelineContent) {
      timelineContent.innerHTML = '';
    }
    
    // Add stored notes as timeline entries
    notesData.forEach((note, index) => {
      const entryElement = this.createTimelineEntry(note, index);
      timelineContent.appendChild(entryElement);
    });
    
    // Add some default entries if no stored notes
    if (notesData.length === 0) {
      this.addDefaultTimelineEntries();
    }
    
    // Re-attach event listeners to new entries
    this.attachTimelineEventListeners();
  }

  createTimelineEntry(note, index) {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(20px)';
    
    entry.innerHTML = `
      <div class="timeline-node">
        <div class="node-circle"></div>
        <div class="node-date">${note.date}</div>
      </div>
      <div class="timeline-content-card">
        <div class="entry-header">
          <h3>${note.title}</h3>
          <div class="entry-status signed">Signed</div>
        </div>
        <div class="entry-summary">
          <p>${note.summary}</p>
        </div>
        <div class="entry-meta">
          <span class="hash-id">Hash: ${note.hash}</span>
          <span class="entry-time">${note.time}</span>
        </div>
        <div class="entry-actions">
          <button class="action-btn view-btn" data-note-id="${note.id}">View Full Note</button>
          <button class="action-btn export-btn" data-note-id="${note.id}">Export</button>
        </div>
      </div>
    `;
    
    // Store note data for export
    entry.dataset.noteData = JSON.stringify(note);
    
    return entry;
  }

  addDefaultTimelineEntries() {
    // Add some default entries for demonstration
    const defaultEntries = [
      {
        date: 'Dec 20, 2024',
        time: '2:15 PM',
        title: 'Annual Physical Examination',
        summary: 'Complete annual physical performed. Patient in good health with normal vital signs.',
        hash: this.generateHash(),
        id: 'default_1'
      },
      {
        date: 'Dec 15, 2024',
        time: '11:00 AM',
        title: 'Initial Consultation',
        summary: 'New patient consultation. Comprehensive medical history taken.',
        hash: this.generateHash(),
        id: 'default_2'
      }
    ];
    
    const timelineContent = document.querySelector('.timeline-entries');
    defaultEntries.forEach((entry, index) => {
      const entryElement = this.createTimelineEntry(entry, index);
      timelineContent.appendChild(entryElement);
    });
  }

  attachTimelineEventListeners() {
    // Re-attach event listeners to new timeline entries
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.viewFullNote(e));
    });

    const exportBtns = document.querySelectorAll('.export-btn');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.exportNote(e));
    });
  }

  updateConsultationList() {
    // Update consultation list with patients from stored notes
    const consultationItems = document.querySelector('.consultation-items');
    if (!consultationItems) return;
    
    // Get unique patients from stored notes
    const uniquePatients = {};
    this.storedNotes.forEach(note => {
      if (!uniquePatients[note.patientName]) {
        uniquePatients[note.patientName] = {
          name: note.patientName,
          id: note.patientId,
          lastVisit: note.date,
          lastVisitType: note.title,
          noteCount: 0
        };
      }
      uniquePatients[note.patientName].noteCount++;
    });
    
    // Clear existing items
    consultationItems.innerHTML = '';
    
    // Add patient items
    Object.values(uniquePatients).forEach(patient => {
      const itemElement = this.createConsultationItem(patient);
      consultationItems.appendChild(itemElement);
    });
    
    // Update consultation count
    const countElement = document.querySelector('.consultation-count');
    if (countElement) {
      countElement.textContent = Object.keys(uniquePatients).length || 1;
    }
    
    // Re-attach event listeners
    const items = consultationItems.querySelectorAll('.consultation-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => this.selectConsultation(e));
    });
    
    // Select first patient if none selected
    if (!this.selectedPatient && items.length > 0) {
      items[0].click();
    }
  }

  createConsultationItem(patient) {
    const item = document.createElement('div');
    item.className = 'consultation-item';
    
    item.innerHTML = `
      <div class="consultation-date">
        <span class="date">${patient.lastVisit}</span>
        <span class="time">${patient.noteCount} notes</span>
      </div>
      <div class="consultation-info">
        <h4>${patient.name}</h4>
        <p>${patient.lastVisitType}</p>
      </div>
    `;
    
    item.dataset.patientName = patient.name;
    item.dataset.patientId = patient.id;
    
    return item;
  }

  handleNavigation(e) {
    const tab = e.target;
    const tabText = tab.textContent;
    
    if (tabText === 'Patient Timeline') {
      // Already on timeline
      return;
    }
    
    // Navigate to other pages
    const pageMap = {
      'Dashboard': 'index.html',
      'Voice Workspace': 'medledger.html',
      'Settings': '#'
    };
    
    const targetPage = pageMap[tabText];
    if (targetPage && targetPage !== '#') {
      window.location.href = targetPage;
    } else {
      this.showNotification(`${tabText} coming soon!`, 'info');
    }
  }

  handleLogout() {
    this.showNotification('Logging out...', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  showUserProfile() {
    this.showNotification('User profile coming soon!', 'info');
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + E to export all
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      this.exportAllNotes();
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
      this.hideNoteModal();
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    const colors = {
      success: 'var(--color-accent-green)',
      error: 'var(--color-accent-red)',
      info: 'var(--color-primary)',
      warning: '#FFA500'
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      min-width: 300px;
      animation: slideIn 0.3s ease;
      backdrop-filter: blur(10px);
      font-family: var(--font-family);
      font-weight: var(--font-weight-medium);
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: auto;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.addEventListener('click', () => notification.remove());
  }

  // Emergency View Methods
  showEmergencyView() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Update emergency content with current patient data
      this.updateEmergencyContent();
      
      this.showNotification('Emergency view opened', 'warning');
    }
  }

  hideEmergencyView() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  updateEmergencyContent() {
    if (!this.selectedPatient) return;
    
    // Update patient info in emergency header
    const patientNameElement = document.querySelector('.emergency-patient-info h2');
    const patientInfoElement = document.querySelector('.emergency-patient-info p');
    
    if (patientNameElement) {
      patientNameElement.textContent = this.selectedPatient.name;
    }
    
    if (patientInfoElement) {
      patientInfoElement.textContent = `Patient ID: ${this.selectedPatient.id} | Age: 34 | Blood Type: O+`;
    }
    
    // Update critical information based on stored notes
    this.updateEmergencyAllergies();
    this.updateEmergencyDiagnoses();
    this.updateEmergencyMedications();
    this.updateEmergencyTimestamp();
  }

  updateEmergencyAllergies() {
    // Check for allergy information in stored notes
    const allergySection = document.querySelector('.emergency-card.critical .card-content');
    if (!allergySection) return;
    
    let allergyInfo = {
      name: 'Amoxicillin',
      reaction: 'SEVERE REACTION',
      stoppedDate: 'Dec 20, 2024',
      details: 'Allergic reaction including rash and difficulty breathing'
    };
    
    // Look for allergy information in stored notes
    this.storedNotes.forEach(note => {
      if (note.patientName === this.selectedPatient.name) {
        if (note.subjective && note.subjective.toLowerCase().includes('allergic')) {
          allergyInfo.details = note.subjective;
        }
        if (note.assessment && note.assessment.toLowerCase().includes('amoxicillin')) {
          allergyInfo.details = note.assessment;
        }
      }
    });
    
    allergySection.innerHTML = `
      <div class="allergy-item severe">
        <span class="allergy-name">${allergyInfo.name}</span>
        <span class="reaction-severe">${allergyInfo.reaction}</span>
      </div>
      <div class="allergy-note">
        <strong>Stopped:</strong> ${allergyInfo.stoppedDate} due to ${allergyInfo.details}
      </div>
    `;
  }

  updateEmergencyDiagnoses() {
    const diagnosisSection = document.querySelector('.emergency-card:nth-child(2) .card-content');
    if (!diagnosisSection) return;
    
    let diagnoses = [];
    
    // Extract diagnoses from stored notes
    this.storedNotes.forEach(note => {
      if (note.patientName === this.selectedPatient.name && note.assessment) {
        const assessmentLines = note.assessment.split('.').filter(line => line.trim());
        assessmentLines.forEach(line => {
          if (line.toLowerCase().includes('diagnosis') || 
              line.toLowerCase().includes('infection') ||
              line.toLowerCase().includes('hypertension')) {
            diagnoses.push({
              name: line.trim(),
              date: note.date
            });
          }
        });
      }
    });
    
    // Remove duplicates and limit to recent ones
    diagnoses = diagnoses.slice(0, 3);
    
    if (diagnoses.length === 0) {
      diagnoses = [
        { name: 'Upper Respiratory Infection', date: 'Dec 24, 2024' },
        { name: 'Hypertension', date: 'Dec 20, 2024' },
        { name: 'Seasonal Allergies', date: 'Nov 10, 2024' }
      ];
    }
    
    diagnosisSection.innerHTML = diagnoses.map(diagnosis => `
      <div class="diagnosis-item">
        <span class="diagnosis-name">${diagnosis.name}</span>
        <span class="diagnosis-date">${diagnosis.date}</span>
      </div>
    `).join('');
  }

  updateEmergencyMedications() {
    const medicationSection = document.querySelector('.emergency-card:nth-child(3) .card-content');
    if (!medicationSection) return;
    
    let medications = {
      stopped: [],
      active: []
    };
    
    // Extract medication information from stored notes
    this.storedNotes.forEach(note => {
      if (note.patientName === this.selectedPatient.name) {
        if (note.plan) {
          const planLines = note.plan.split('.').filter(line => line.trim());
          planLines.forEach(line => {
            if (line.toLowerCase().includes('amoxicillin')) {
              medications.stopped.push({
                name: 'Amoxicillin 500mg',
                reason: 'Allergic reaction - rash, urticaria, mild respiratory distress'
              });
            }
            if (line.toLowerCase().includes('paracetamol') || line.toLowerCase().includes('acetaminophen')) {
              medications.active.push({
                name: 'Paracetamol 500mg',
                purpose: 'Fever management, PRN use'
              });
            }
          });
        }
      }
    });
    
    // Default medications if none found
    if (medications.stopped.length === 0) {
      medications.stopped.push({
        name: 'Amoxicillin 500mg',
        reason: 'Allergic reaction - rash, urticaria, mild respiratory distress'
      });
    }
    
    if (medications.active.length === 0) {
      medications.active.push({
        name: 'Paracetamol 500mg',
        purpose: 'Fever management, PRN use'
      });
    }
    
    medicationSection.innerHTML = `
      ${medications.stopped.map(med => `
        <div class="medication-item stopped">
          <span class="med-name">${med.name}</span>
          <span class="med-status">STOPPED</span>
        </div>
        <div class="med-note">
          <strong>Reason:</strong> ${med.reason}
        </div>
      `).join('')}
      
      ${medications.active.map(med => `
        <div class="medication-item active">
          <span class="med-name">${med.name}</span>
          <span class="med-status">ACTIVE</span>
        </div>
        <div class="med-note">
          <strong>For:</strong> ${med.purpose}
        </div>
      `).join('')}
    `;
  }

  updateEmergencyTimestamp() {
    const timestampElement = document.querySelector('.emergency-timestamp');
    if (!timestampElement) return;
    
    // Get most recent note for timestamp
    const patientNotes = this.storedNotes.filter(note => 
      note.patientName === this.selectedPatient.name
    );
    
    if (patientNotes.length > 0) {
      const latestNote = patientNotes[0];
      timestampElement.textContent = `Last Updated: ${latestNote.date} at ${latestNote.time} | Hash: ${latestNote.hash}`;
    }
  }

  downloadEmergencyPDF() {
    // Generate emergency summary content
    const emergencyContent = this.generateEmergencyPDFContent();
    
    // Create and download PDF (simulated as text file)
    const blob = new Blob([emergencyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMERGENCY_${this.selectedPatient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('Emergency summary downloaded', 'success');
  }

  generateEmergencyPDFContent() {
    const patientName = this.selectedPatient.name;
    const patientId = this.selectedPatient.id;
    const timestamp = new Date().toLocaleString();
    
    return `
EMERGENCY PATIENT SUMMARY
========================

PATIENT INFORMATION
------------------
Name: ${patientName}
ID: ${patientId}
Age: 34
Blood Type: O+
Generated: ${timestamp}

⚠️ CRITICAL ALLERGIES ⚠️
-------------------------
• Amoxicillin - SEVERE REACTION
  Stopped: Dec 20, 2024
  Details: Allergic reaction including rash and difficulty breathing

KEY DIAGNOSES
--------------
• Upper Respiratory Infection (Dec 24, 2024)
• Hypertension (Dec 20, 2024)
• Seasonal Allergies (Nov 10, 2024)

MEDICATION HISTORY
-----------------
STOPPED:
• Amoxicillin 500mg - Allergic reaction

ACTIVE:
• Paracetamol 500mg - Fever management, PRN use

RECENT VITALS
-------------
BP: 140/90 (Dec 24)
HR: 72 (Dec 24)
Temp: 98.6°F (Dec 24)
RR: 16 (Dec 24)

EMERGENCY CONTACTS
------------------
• Michael Johnson (Spouse) - +1 (555) 123-4567
• Dr. Emily Chen (PCP) - +1 (555) 987-6543

IMPORTANT NOTES
--------------
• DO NOT ADMINISTER AMOXICILLIN OR PENICILLIN DERIVATIVES
• Use alternative antibiotics for infections
• Monitor for respiratory distress
• Contact PCP for any medication questions

⚠️ THIS IS AN EMERGENCY SUMMARY - VERIFY ALL INFORMATION ⚠️
    `.trim();
  }

  shareSecureLink() {
    // Generate fake secure link
    const secureLink = this.generateSecureLink();
    
    // Copy to clipboard
    navigator.clipboard.writeText(secureLink).then(() => {
      this.showNotification('Secure link copied to clipboard', 'success');
    }).catch(() => {
      // Fallback if clipboard API fails
      this.showSecureLinkModal(secureLink);
    });
  }

  generateSecureLink() {
    const patientId = this.selectedPatient.id;
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substring(2, 15);
    
    return `https://medledger.secure/emergency/${patientId}/${timestamp}/${randomHash}`;
  }

  showSecureLinkModal(link) {
    // Create modal to show link
    const modal = document.createElement('div');
    modal.className = 'secure-link-modal';
    modal.innerHTML = `
      <div class="secure-link-content">
        <h3>Secure Emergency Link Generated</h3>
        <div class="link-container">
          <input type="text" value="${link}" readonly>
          <button onclick="navigator.clipboard.writeText('${link}').then(() => this.parentElement.parentElement.remove())">Copy</button>
        </div>
        <p>This link will expire in 24 hours for security.</p>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
    `;
    
    const content = modal.querySelector('.secure-link-content');
    content.style.cssText = `
      background: white;
      padding: 32px;
      border-radius: 16px;
      max-width: 500px;
      text-align: center;
    `;
    
    const linkContainer = modal.querySelector('.link-container');
    linkContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin: 16px 0;
    `;
    
    const input = modal.querySelector('input');
    input.style.cssText = `
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    `;
    
    const copyBtn = modal.querySelector('.link-container button');
    copyBtn.style.cssText = `
      padding: 8px 16px;
      background: #1E5EFF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    document.body.appendChild(modal);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TimelineApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimelineApp;
}
