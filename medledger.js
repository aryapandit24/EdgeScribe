// MedLedger Voice Workspace JavaScript
class MedLedgerApp {
  constructor() {
    this.isRecording = false;
    this.selectedSentences = new Set();
    this.isSigned = false;
    this.transcriptSourceMap = new Map();
    this.currentEditingSentence = null;
    this.currentPatientData = {
      name: 'Sarah Johnson',
      id: 'PT-2024-0847'
    };
    this.init();
  }

  init() {
    console.log('MedLedger Voice Workspace initialized');
    this.setupEventListeners();
    this.initializeRecording();
    this.setupSentenceBlocks();
    this.loadMockTranscript();
    this.initializeLocalStorage();
  }

  setupEventListeners() {
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // Record button
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => this.toggleRecording());
    }

    // Sign & Approve button
    const signApproveBtn = document.getElementById('signApproveBtn');
    if (signApproveBtn) {
      signApproveBtn.addEventListener('click', () => this.showConfirmationModal());
    }

    // Modal controls
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalOverlay = document.getElementById('confirmModal');

    if (modalClose) modalClose.addEventListener('click', () => this.hideModal());
    if (modalCancel) modalCancel.addEventListener('click', () => this.hideModal());
    if (modalConfirm) modalConfirm.addEventListener('click', () => this.signAndApprove());
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) this.hideModal();
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

  initializeRecording() {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Recording not supported in this browser');
      return;
    }

    // Initialize recording state
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async toggleRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');

    if (!this.isRecording) {
      try {
        await this.startRecording();
        recordBtn.classList.add('recording');
        statusText.textContent = 'Recording...';
        statusDot.style.background = 'var(--color-accent-red)';
        this.isRecording = true;
        this.showNotification('Recording started', 'success');
      } catch (error) {
        console.error('Error starting recording:', error);
        this.showNotification('Failed to start recording', 'error');
      }
    } else {
      this.stopRecording();
      recordBtn.classList.remove('recording');
      statusText.textContent = 'Stopped';
      statusDot.style.background = 'var(--color-text-muted)';
      this.isRecording = false;
      this.showNotification('Recording stopped', 'info');
    }
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.processAudio(audioBlob);
      };

      this.mediaRecorder.start();
      this.simulateLiveTranscription();
    } catch (error) {
      throw new Error('Microphone access denied');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  simulateLiveTranscription() {
    const transcriptTextarea = document.querySelector('.transcript-textarea');
    const hinglishTranscript = [
      "Patient ko 3 din se fever hai, mild cough hai, Amoxicillin diya tha but stop kar diya due to allergy.",
      "Patient ne bataya ki head bhi dard hot hai subah, body bhi pain kar rahi hai.",
      "BP check kiya - 140/90 hai, thoda high hai, par tension nahi liya.",
      "Throat dekha toh redness hai, par koi major infection nahi dikh rahi.",
      "Patient ko advise kiya rest karo, or paracetamol lo fever ke liye."
    ];

    // Clear existing transcript
    transcriptTextarea.value = '';
    
    let index = 0;
    const interval = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(interval);
        return;
      }

      if (index < hinglishTranscript.length) {
        const currentText = transcriptTextarea.value;
        const newSentence = hinglishTranscript[index];
        transcriptTextarea.value = currentText + (currentText ? '\n\n' : '') + newSentence;
        transcriptTextarea.scrollTop = transcriptTextarea.scrollHeight;
        
        // Store transcript for source mapping
        this.transcriptSourceMap.set(`sentence_${index}`, newSentence);
        
        index++;
      } else {
        clearInterval(interval);
        // Auto-generate SOAP after transcription completes
        setTimeout(() => this.generateSOAPFromTranscript(), 1000);
      }
    }, 1500);
  }

  processAudio(audioBlob) {
    // In a real application, this would send the audio to a transcription service
    console.log('Audio processed:', audioBlob);
    
    // Simulate processing delay
    setTimeout(() => {
      this.showNotification('Transcription completed', 'success');
      // SOAP generation is now handled in simulateLiveTranscription callback
    }, 1000);
  }

  generateSOAPFromTranscript() {
    const soapContent = {
      subjective: [
        { text: "Patient presents with 3-day history of fever and mild cough.", source: "Patient ko 3 din se fever hai, mild cough hai" },
        { text: "Amoxicillin was discontinued due to allergic reaction.", source: "Amoxicillin diya tha but stop kar diya due to allergy" },
        { text: "Patient also reports morning headaches and body pain.", source: "head bhi dard hot hai subah, body bhi pain kar rahi hai" }
      ],
      objective: [
        { text: "Blood pressure recorded at 140/90 mmHg.", source: "BP check kiya - 140/90 hai" },
        { text: "Throat examination reveals redness without significant infection.", source: "Throat dekha toh redness hai" },
        { text: "Patient appears alert and oriented.", source: "tension nahi liya" }
      ],
      assessment: [
        { text: "Diagnosis: Upper respiratory infection with hypertension.", source: "fever hai, mild cough hai, BP 140/90" },
        { text: "Drug allergy: Amoxicillin.", source: "Amoxicillin diya tha but stop kar diya due to allergy" },
        { text: "Condition: Stable, requires symptomatic treatment.", source: "koi major infection nahi dikh rahi" }
      ],
      plan: [
        { text: "Prescribe paracetamol for fever management.", source: "paracetamol lo fever ke liye" },
        { text: "Advise rest and increased fluid intake.", source: "rest karo" },
        { text: "Follow up in 3 days if symptoms persist.", source: "Patient ko advise kiya" },
        { text: "Monitor blood pressure regularly.", source: "BP 140/90 hai, thoda high hai" }
      ]
    };

    // Update SOAP sections with generated content
    this.updateSOAPSections(soapContent);
    this.showNotification('SOAP note auto-generated from transcript', 'success');
  }

  updateSOAPSections(soapContent) {
    const sections = ['subjective', 'objective', 'assessment', 'plan'];
    
    sections.forEach((sectionType, sectionIndex) => {
      const sectionElement = document.querySelector(`.soap-section:nth-child(${sectionIndex + 1}) .section-content`);
      if (sectionElement) {
        // Clear existing content
        sectionElement.innerHTML = '';
        
        // Add new sentences with source mapping
        soapContent[sectionType].forEach((item, index) => {
          const sentenceBlock = document.createElement('div');
          sentenceBlock.className = 'sentence-block';
          sentenceBlock.dataset.sentenceId = `${sectionType}_${index}`;
          sentenceBlock.dataset.source = item.source;
          sentenceBlock.textContent = item.text;
          
          sectionElement.appendChild(sentenceBlock);
          
          // Add event listeners
          sentenceBlock.addEventListener('click', (e) => this.handleSentenceClick(e));
          sentenceBlock.addEventListener('mouseenter', (e) => this.handleSentenceHover(e));
          sentenceBlock.addEventListener('mouseleave', (e) => this.handleSentenceLeave(e));
          
          // Animate appearance
          setTimeout(() => {
            sentenceBlock.style.background = 'rgba(46, 212, 122, 0.1)';
            setTimeout(() => {
              sentenceBlock.style.background = '';
            }, 1000);
          }, index * 200);
        });
      }
    });
  }

  updateSOAPNote() {
    // Simulate AI-generated SOAP note updates
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
      const sentences = section.querySelectorAll('.sentence-block');
      sentences.forEach(sentence => {
        sentence.style.background = 'rgba(46, 212, 122, 0.1)';
        setTimeout(() => {
          sentence.style.background = '';
        }, 2000);
      });
    });
  }

  setupSentenceBlocks() {
    const sentenceBlocks = document.querySelectorAll('.sentence-block');
    
    sentenceBlocks.forEach(block => {
      block.addEventListener('click', (e) => this.handleSentenceClick(e));
      block.addEventListener('mouseenter', (e) => this.handleSentenceHover(e));
      block.addEventListener('mouseleave', (e) => this.handleSentenceLeave(e));
    });
  }

  handleSentenceClick(e) {
    if (this.isSigned) {
      this.showNotification('Cannot edit - document is signed', 'warning');
      return;
    }

    const block = e.target;
    const sentenceId = block.dataset.sentenceId;
    const sourceText = block.dataset.source;
    
    // Remove previous selection
    document.querySelectorAll('.sentence-block').forEach(b => {
      b.classList.remove('selected');
    });
    
    // Highlight current sentence
    block.classList.add('selected');
    
    // Show source popup
    this.showSourcePopup(block, sourceText);
    
    // Enable inline editing on double click
    block.addEventListener('dblclick', () => this.enableInlineEditing(block), { once: true });
  }

  handleSentenceHover(e) {
    const block = e.target;
    block.style.cursor = 'pointer';
    
    // Show tooltip with sentence info
    this.showSentenceTooltip(block);
  }

  handleSentenceLeave(e) {
    this.hideSentenceTooltip();
  }

  showSentenceTooltip(block) {
    // Don't show tooltip if showing source popup
    if (document.querySelector('.source-popup')) {
      return;
    }
    
    // Create tooltip if it doesn't exist
    let tooltip = document.querySelector('.sentence-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'sentence-tooltip';
      document.body.appendChild(tooltip);
    }

    const rect = block.getBoundingClientRect();
    tooltip.textContent = 'Click to view source • Double-click to edit';
    tooltip.style.cssText = `
      position: absolute;
      top: ${rect.top - 30}px;
      left: ${rect.left + rect.width / 2}px;
      transform: translateX(-50%);
      background: var(--color-dark-blue);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);
  }

  showSourcePopup(block, sourceText) {
    // Remove existing popup
    const existingPopup = document.querySelector('.source-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create source popup
    const popup = document.createElement('div');
    popup.className = 'source-popup';
    popup.innerHTML = `
      <div class="source-header">Source Transcript</div>
      <div class="source-text">${sourceText}</div>
      <div class="source-actions">
        <button class="edit-btn">Edit</button>
        <button class="close-btn">Close</button>
      </div>
    `;

    // Position popup below the sentence
    const rect = block.getBoundingClientRect();
    popup.style.cssText = `
      position: absolute;
      top: ${rect.bottom + 8}px;
      left: ${rect.left}px;
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 12px;
      z-index: 1001;
      min-width: 300px;
      max-width: 400px;
      animation: fadeInUp 0.3s ease;
    `;

    // Add popup styles
    const popupStyles = `
      .source-header {
        font-weight: 600;
        color: var(--color-dark-blue);
        margin-bottom: 8px;
        font-size: 14px;
      }
      .source-text {
        background: var(--color-background);
        padding: 8px;
        border-radius: 4px;
        font-size: 13px;
        color: var(--color-text-secondary);
        margin-bottom: 12px;
        font-style: italic;
      }
      .source-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .source-actions button {
        padding: 4px 12px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .edit-btn {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
      .edit-btn:hover {
        background: var(--color-dark-blue);
      }
      .close-btn {
        background: white;
        color: var(--color-text-secondary);
      }
      .close-btn:hover {
        background: var(--color-border);
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    // Add styles to head if not already present
    if (!document.querySelector('#source-popup-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'source-popup-styles';
      styleSheet.textContent = popupStyles;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(popup);

    // Add event listeners
    popup.querySelector('.edit-btn').addEventListener('click', () => {
      this.enableInlineEditing(block);
      popup.remove();
    });

    popup.querySelector('.close-btn').addEventListener('click', () => {
      popup.remove();
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 5000);
  }

  enableInlineEditing(block) {
    if (this.isSigned) {
      this.showNotification('Cannot edit - document is signed', 'warning');
      return;
    }

    const originalText = block.textContent;
    
    // Create input field
    const input = document.createElement('textarea');
    input.value = originalText;
    input.style.cssText = `
      width: 100%;
      min-height: 60px;
      padding: 8px;
      border: 2px solid var(--color-primary);
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      resize: vertical;
      outline: none;
    `;

    // Replace block with input
    block.style.display = 'none';
    block.parentNode.insertBefore(input, block.nextSibling);
    
    input.focus();
    input.select();

    // Save on Enter or blur
    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== originalText) {
        block.textContent = newText;
        block.dataset.source = `Edited: ${originalText}`;
        this.showNotification('Sentence updated', 'success');
      }
      block.style.display = '';
      input.remove();
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        saveEdit();
      }
      if (e.key === 'Escape') {
        block.style.display = '';
        input.remove();
      }
    });

    input.addEventListener('blur', saveEdit);
  }

  hideSentenceTooltip() {
    const tooltip = document.querySelector('.sentence-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        tooltip.remove();
      }, 200);
    }
  }

  loadMockTranscript() {
    const transcriptTextarea = document.querySelector('.transcript-textarea');
    if (transcriptTextarea) {
      // Transcript is already loaded in HTML
      transcriptTextarea.scrollTop = transcriptTextarea.scrollHeight;
    }
  }

  showConfirmationModal() {
    const modalOverlay = document.getElementById('confirmModal');
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  hideModal() {
    const modalOverlay = document.getElementById('confirmModal');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  signAndApprove() {
    // Add signing animation to button
    const signBtn = document.getElementById('signApproveBtn');
    if (signBtn) {
      signBtn.classList.add('signing');
      signBtn.textContent = 'Signing...';
    }
    
    this.showNotification('SOAP note signing in progress...', 'info');
    
    // Simulate saving to database
    setTimeout(() => {
      this.hideModal();
      this.generateAndStoreSignedNote();
      this.lockDocument();
      this.showSuccessAnimation();
      this.addImmutableBadge();
      this.showNotification('Note saved to patient record', 'success');
      
      // Update button state
      if (signBtn) {
        signBtn.classList.remove('signing');
        signBtn.classList.add('signed');
        signBtn.textContent = 'Signed';
      }
    }, 1500);
  }

  generateAndStoreSignedNote() {
    // Generate SHA-like hash
    const hash = this.generateSHAHash();
    
    // Collect current note data
    const noteData = this.collectCurrentNoteData();
    
    // Create signed note object
    const signedNote = {
      id: hash,
      patientName: this.currentPatientData.name,
      patientId: this.currentPatientData.id,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      title: this.generateNoteTitle(),
      summary: this.generateNoteSummary(),
      hash: hash,
      subjective: this.extractSectionContent('subjective'),
      objective: this.extractSectionContent('objective'),
      assessment: this.extractSectionContent('assessment'),
      plan: this.extractSectionContent('plan'),
      transcript: this.getTranscriptContent(),
      signedAt: new Date().toISOString(),
      status: 'signed'
    };
    
    // Store in localStorage
    this.storeSignedNote(signedNote);
    
    // Update current note with hash
    this.currentNoteHash = hash;
    
    console.log('Signed note stored:', signedNote);
  }

  generateSHAHash() {
    // Generate a realistic SHA-like hash (32 characters)
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  collectCurrentNoteData() {
    const sections = {};
    const sectionElements = document.querySelectorAll('.soap-section');
    
    sectionElements.forEach((section, index) => {
      const sectionName = ['subjective', 'objective', 'assessment', 'plan'][index];
      const content = section.querySelector('.section-content');
      if (content) {
        sections[sectionName] = content.innerText.trim();
      }
    });
    
    return sections;
  }

  generateNoteTitle() {
    const transcript = this.getTranscriptContent();
    
    // Generate title based on transcript content
    if (transcript.toLowerCase().includes('fever') && transcript.toLowerCase().includes('cough')) {
      return 'Fever & Cough Follow-up';
    } else if (transcript.toLowerCase().includes('pain') || transcript.toLowerCase().includes('ache')) {
      return 'Pain Management Consultation';
    } else if (transcript.toLowerCase().includes('checkup') || transcript.toLowerCase().includes('physical')) {
      return 'Physical Examination';
    } else if (transcript.toLowerCase().includes('medication') || transcript.toLowerCase().includes('medicine')) {
      return 'Medication Review';
    } else {
      return 'General Consultation';
    }
  }

  generateNoteSummary() {
    const sections = this.collectCurrentNoteData();
    const subjective = sections.subjective || '';
    
    // Extract first sentence from subjective as summary
    const sentences = subjective.split('.').filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      return sentences[0].trim() + '.';
    }
    
    return 'Patient consultation completed with comprehensive evaluation.';
  }

  extractSectionContent(sectionName) {
    const sectionMap = {
      'subjective': 0,
      'objective': 1,
      'assessment': 2,
      'plan': 3
    };
    
    const sectionIndex = sectionMap[sectionName];
    const sectionElement = document.querySelectorAll('.soap-section')[sectionIndex];
    
    if (sectionElement) {
      const content = sectionElement.querySelector('.section-content');
      return content ? content.innerText.trim() : '';
    }
    
    return '';
  }

  getTranscriptContent() {
    const transcriptTextarea = document.querySelector('.transcript-textarea');
    return transcriptTextarea ? transcriptTextarea.value.trim() : '';
  }

  storeSignedNote(signedNote) {
    // Get existing notes from localStorage
    const existingNotes = this.getStoredNotes();
    
    // Add new note to the beginning
    existingNotes.unshift(signedNote);
    
    // Keep only last 50 notes to prevent localStorage overflow
    if (existingNotes.length > 50) {
      existingNotes.splice(50);
    }
    
    // Store back to localStorage
    localStorage.setItem('medledger_signed_notes', JSON.stringify(existingNotes));
    
    // Store current patient info
    localStorage.setItem('medledger_current_patient', JSON.stringify({
      name: this.currentPatientData.name,
      id: this.currentPatientData.id
    }));
    
    this.showNotification(`Note stored with hash: ${signedNote.hash}`, 'success');
  }

  getStoredNotes() {
    try {
      const stored = localStorage.getItem('medledger_signed_notes');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored notes:', error);
      return [];
    }
  }

  initializeLocalStorage() {
    // Check if there are existing notes
    const existingNotes = this.getStoredNotes();
    console.log(`Found ${existingNotes.length} stored notes`);
    
    // Load current patient info if available
    try {
      const currentPatient = localStorage.getItem('medledger_current_patient');
      if (currentPatient) {
        const patient = JSON.parse(currentPatient);
        this.currentPatientData = patient;
        console.log('Loaded patient data:', patient);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  }

  lockDocument() {
    this.isSigned = true;
    
    // Add locked state visual to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('locked-state');
    }
    
    // Disable all sentence editing
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
      section.contentEditable = false;
      section.style.background = 'var(--color-background)';
      section.style.cursor = 'not-allowed';
      section.style.position = 'relative';
    });

    // Disable sentence interactions
    const sentenceBlocks = document.querySelectorAll('.sentence-block');
    sentenceBlocks.forEach(block => {
      block.style.cursor = 'not-allowed';
      block.style.opacity = '0.8';
      block.style.position = 'relative';
      // Add shield overlay
      this.addShieldOverlay(block);
      // Remove event listeners
      block.replaceWith(block.cloneNode(true));
    });

    // Update sign button
    const signBtn = document.getElementById('signApproveBtn');
    if (signBtn) {
      signBtn.textContent = 'Signed';
      signBtn.disabled = true;
      signBtn.style.background = 'var(--color-text-muted)';
      signBtn.style.cursor = 'not-allowed';
      signBtn.style.position = 'relative';
      this.addShieldOverlay(signBtn);
    }

    // Update status
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    if (statusText && statusDot) {
      statusText.textContent = 'Document Signed';
      statusDot.style.background = 'var(--color-accent-green)';
    }
  }

  addShieldOverlay(element) {
    // Create shield overlay
    const shield = document.createElement('div');
    shield.className = 'shield-overlay';
    shield.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1L14 4L19 4L19 9L16 13L10 19L4 13L1 9L1 4L6 4L10 1Z" fill="rgba(46, 212, 122, 0.8)" stroke="white" stroke-width="1"/>
        <path d="M7 10L8.5 11.5L13 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    shield.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background: rgba(46, 212, 122, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: none;
      animation: shieldAppear 0.5s ease-out;
      box-shadow: 0 4px 12px rgba(46, 212, 122, 0.3);
    `;
    
    element.appendChild(shield);
    
    // Add animation styles if not already present
    if (!document.querySelector('#shield-animations')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'shield-animations';
      styleSheet.textContent = `
        @keyframes shieldAppear {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }

  addImmutableBadge() {
    // Create immutable badge
    const badge = document.createElement('div');
    badge.className = 'immutable-badge';
    badge.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L11 4L15 4L15 8L12 11L8 15L4 11L1 8L1 4L4 4L8 1Z" fill="#2ED47A"/>
        <path d="M6 8L7 9L10 6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>Immutable Record</span>
    `;

    badge.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-accent-green);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideInDown 0.5s ease;
    `;

    // Add animation
    if (!document.querySelector('#badge-animations')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'badge-animations';
      styleSheet.textContent = `
        @keyframes slideInDown {
          from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(badge);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      badge.style.animation = 'slideInDown 0.5s ease reverse';
      setTimeout(() => badge.remove(), 500);
    }, 5000);
  }

  disableEditing() {
    // This method is now replaced by lockDocument()
    // Keeping for backward compatibility
    this.lockDocument();
  }

  handleNavigation(e) {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');

    const section = e.target.textContent;
    this.showNotification(`Navigating to ${section}`, 'info');
    
    // In a real app, this would load different content
    if (section !== 'Voice Workspace') {
      this.showNotification(`${section} coming soon!`, 'info');
    }
  }

  handleLogout() {
    this.showNotification('Logging out...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  showUserProfile() {
    this.showNotification('User profile coming soon!', 'info');
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R to toggle recording
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      this.toggleRecording();
    }
    
    // Ctrl/Cmd + S to sign and approve
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      this.showConfirmationModal();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
      this.hideModal();
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
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      font-family: var(--font-family);
      font-weight: var(--font-weight-medium);
      transform: translateX(0) translateZ(0);
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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
      transition: all 0.2s ease;
    `;
    closeBtn.addEventListener('click', () => notification.remove());
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      closeBtn.style.borderRadius = '50%';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none';
    });
  }

  showSuccessAnimation() {
    // Create success checkmark
    const successCheckmark = document.createElement('div');
    successCheckmark.className = 'success-checkmark';
    successCheckmark.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 13L9 17L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Add to page
    document.body.appendChild(successCheckmark);

    // Remove after animation
    setTimeout(() => {
      successCheckmark.style.animation = 'successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
      setTimeout(() => successCheckmark.remove(), 600);
    }, 2000);
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
  new MedLedgerApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MedLedgerApp;
}
