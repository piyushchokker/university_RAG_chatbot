// API Configuration
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000' 
    : window.location.origin;

// Course data based on schools
const coursesBySchool = {
    'soet': [
        { value: 'btech_cse', label: 'B.Tech. Computer Science and Engineering' },
        { value: 'btech_cse_lateral', label: 'B.Tech. Computer Science and Engineering (Lateral)' },
        { value: 'btech_cse_aiml_ibm_ms', label: 'B.Tech. Computer Science and Engineering (AI & ML) with academic support of IBM & powered by Microsoft Certifications' },
        { value: 'btech_cse_aiml_ibm_samatrix_lateral', label: 'B.Tech. Computer Science and Engineering (AI & ML) with academic support of Samatrix & IBM (Lateral)' },
        { value: 'btech_cse_fsd_imaginxp', label: 'B.Tech. Computer Science and Engineering (Full Stack Development) with academic support of ImaginXP' },
        { value: 'btech_cse_fsd_xebia_lateral', label: 'B.Tech. Computer Science and Engineering (Full Stack Development) with academic support of Xebia (Lateral)' },
        { value: 'btech_cse_uxui_imaginxp', label: 'B.Tech. Computer Science & Engineering (UX/UI) with academic support of ImaginXP' },
        { value: 'btech_cse_uxui_imaginxp_lateral', label: 'B.Tech. Computer Science and Engineering (UX/UI) with academic support of ImaginXP (Lateral)' },
        { value: 'btech_cse_cybersec_ec_ibm', label: 'B.Tech. Computer Science and Engineering (Cyber Security) with academic support of EC-Council and IBM' },
        { value: 'btech_cse_cybersec_ec_ibm_lateral', label: 'B.Tech. Computer Science and Engineering (Cyber Security) with academic support of EC-Council and IBM (Lateral)' },
        { value: 'btech_cse_datascience_ibm', label: 'B.Tech. Computer Science and Engineering (Data Science) with academic support of IBM' },
        { value: 'btech_cse_datascience_ibm_lateral', label: 'B.Tech. Computer Science and Engineering (Data Science) with academic support of IBM (Lateral)' },
        { value: 'btech_cse_robotics_ai_ibm_ms', label: 'B.Tech. Computer Science and Engineering (Robotics & AI) with Academic Support of IBM & powered by Microsoft Certifications' },
        { value: 'bca_aiml_datascience_ibm_ms', label: 'BCA (AI & Data Science) with academic support of IBM & powered by Microsoft Certifications' },
        { value: 'bca_hons_aiml_datascience_ibm_ms', label: 'BCA (Hons./ Hons. with Research) AI & Data Science with academic support of IBM & powered by Microsoft Certifications' },
        { value: 'bca_cybersec_ec', label: 'BCA (Cyber Security) with Academic Support of EC Council' },
        { value: 'bca_hons_cybersec_ec', label: 'BCA (Hons./ Hons. with Research) Cyber Security with Academic Support of EC Council' },
        { value: 'bsc_hons_cs_ibm', label: 'B.Sc. (Hons.) Computer Science with academic support of IBM' },
        { value: 'bsc_hons_cybersec', label: 'B.Sc. (Hons.) Cyber Security' },
        { value: 'bsc_hons_datascience', label: 'B.Sc. (Hons.) Data Science' },
        { value: 'mtech_automobile', label: 'M.Tech. in Automobile Engineering' },
        { value: 'mca', label: 'MCA' },
        { value: 'mca_aiml_ibm_ms', label: 'MCA (AI & ML) with academic support of IBM and powered by Microsoft Certifications' },
        { value: 'btech_it', label: 'B.Tech Information Technology' },
        { value: 'btech_ece', label: 'B.Tech Electronics & Communication Engineering' },
        { value: 'btech_me', label: 'B.Tech Mechanical Engineering' },
        { value: 'btech_ce', label: 'B.Tech Civil Engineering' },
        { value: 'btech_ee', label: 'B.Tech Electrical Engineering' },
        { value: 'mtech_cse', label: 'M.Tech Computer Science & Engineering' },
        { value: 'mtech_ece', label: 'M.Tech Electronics & Communication Engineering' },
        { value: 'mtech_me', label: 'M.Tech Mechanical Engineering' },
        { value: 'phd', label: 'Ph.D. (Engineering)' }
    ],
    'som': [
        { value: 'bba_hr_marketing_finance_ib_tourism', label: 'BBA (HR/ Marketing/ Finance/ International Business/ Travel & Tourism)' },
        { value: 'bba_hons_hr_marketing_finance_ib_tourism', label: 'BBA (Hons./ Hons with Research) (HR/ Marketing/ Finance/ International Business/ Travel & Tourism)' },
        { value: 'bba_logistics_supplychain_safexpress', label: 'BBA (Logistics and Supply Chain Management) with academic support of Safexpress' },
        { value: 'bba_hons_logistics_supplychain_safexpress', label: 'BBA (Hons./ Hons with Research) (Logistics and Supply Chain Management) with academic support of Safexpress' },
        { value: 'bba_digital_marketing_iide', label: 'BBA (Digital Marketing) with academic support of IIDE' },
        { value: 'bba_hons_digital_marketing_iide', label: 'BBA (Hons. / Hons. with Research) (Digital Marketing) with academic support of IIDE' },
        { value: 'bba_business_analytics_ey', label: 'BBA (Business Analytics) with academic support of Ernst & Young (EY)' },
        { value: 'bba_hons_business_analytics_ey', label: 'BBA (Hons./ Hons with Research) (Business Analytics) academic support of Ernst & Young (EY)' },
        { value: 'bba_entrepreneurship_gcec', label: 'BBA (Entrepreneurship) with academic support of GCEC Global Foundation' },
        { value: 'bba_hons_entrepreneurship_gcec', label: 'BBA (Hons./ Hons. with Research) (Entrepreneurship) with academic support of GCEC Global Foundation' },
        { value: 'bba_international_accounting_finance_acca_grant_thornton', label: 'BBA (International Accounting and Finance) (ACCA – UK) with academic support of Grant Thornton' },
        { value: 'bba_hons_international_accounting_finance_acca_grant_thornton', label: 'BBA (Hons. / Hons. with Research) (International Accounting and Finance) (ACCA – UK) with academic support of Grant Thornton' },
        { value: 'mba_ibm', label: 'MBA with Academic Support of IBM (Specialization in Human Resources/ Marketing/International Business/Finance and Business Analytics/Information Technology/Entrepreneurship)' },
        { value: 'integrated_bba_mba_ibm', label: 'Integrated BBA + MBA with Academic Support of IBM' },
        { value: 'mba_digital_marketing_iide', label: 'MBA (Digital Marketing) with academic support of IIDE' },
        { value: 'mba_fintech_ey', label: 'MBA (Fintech) with academic support of Ernst & Young (EY)' },
        { value: 'mba_executive', label: 'Executive MBA' },
        { value: 'phd_management', label: 'Ph.D. (Management)' }
    ],
    'sol': [
        { value: 'llb', label: 'LLB (Bachelor of Laws)' },
        { value: 'llm', label: 'LLM (Master of Laws)' },
        { value: 'ba_llb', label: 'BA LLB (Integrated)' }
    ],
    'soa': [
        { value: 'barch', label: 'B.Arch (Bachelor of Architecture)' },
        { value: 'march', label: 'M.Arch (Master of Architecture)' }
    ],
    'sohss': [
        { value: 'ba', label: 'BA (Bachelor of Arts)' },
        { value: 'ma', label: 'MA (Master of Arts)' },
        { value: 'bsc', label: 'B.Sc' },
        { value: 'msc', label: 'M.Sc' }
    ],
    'sopa': [
        { value: 'bpa', label: 'BPA (Bachelor of Performing Arts)' },
        { value: 'mpa', label: 'MPA (Master of Performing Arts)' }
    ],
    'soe': [
        { value: 'bed', label: 'B.Ed (Bachelor of Education)' },
        { value: 'med', label: 'M.Ed (Master of Education)' }
    ],
    'soph': [
        { value: 'bpharm', label: 'B.Pharm (Bachelor of Pharmacy)' },
        { value: 'mpharm', label: 'M.Pharm (Master of Pharmacy)' },
        { value: 'dpharm', label: 'D.Pharm (Diploma in Pharmacy)' }
    ],
    'soc': [
        { value: 'bcom_hons_international_accounting_finance_acca_grant_thornton', label: 'B.Com. (Hons.) (International Accounting and Finance) (ACCA – UK) With academic support of Grant Thornton' },
        { value: 'bcom_hons_research_international_accounting_finance_acca_grant_thornton', label: 'B.Com. (Hons. / Hons. with Research) (International Accounting and Finance) (ACCA – UK) With academic support of Grant Thornton' },
        { value: 'bcom_hons', label: 'B.Com. (Hons.)' },
        { value: 'bcom_hons_research', label: 'B.Com. (Hons. / Hons. With Research)' },
        { value: 'bcom_programme', label: 'B.Com. Programme' },
        { value: 'mcom', label: 'M.Com (Master of Commerce)' }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    const registrarData = localStorage.getItem('registrarData');
    
    if (!token || userType !== 'registrar' || !registrarData) {
        window.location.href = '/index.html';
        return;
    }
    
    try {
        const registrar = JSON.parse(registrarData);
        displayRegistrarInfo(registrar);
    } catch (error) {
        console.error('Error parsing registrar data:', error);
        window.location.href = '/index.html';
    }
    
    // Setup form handlers
    setupSchoolCourseHandler();
    setupFileUploadHandler();
    setupFormSubmission();
    loadUploadedDocuments();
});

// Display registrar information
function displayRegistrarInfo(registrar) {
    const nameElement = document.getElementById('registrarName');
    const deptElement = document.getElementById('registrarDept');
    
    if (nameElement) {
        nameElement.textContent = registrar.full_name || 'Registrar';
    }
    
    if (deptElement) {
        deptElement.textContent = registrar.department || 'Registrar Office';
    }
}

// Setup school and course selection handler
function setupSchoolCourseHandler() {
    const schoolSelect = document.getElementById('schoolSelect');
    const courseSelect = document.getElementById('courseSelect');
    
    // Prevent layout shift by setting title attribute for long text
    function updateSelectTitle(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption && selectedOption.text.length > 50) {
            selectElement.title = selectedOption.text;
        } else {
            selectElement.title = '';
        }
    }
    
    // Add title to all selects to show full text on hover
    [schoolSelect, courseSelect].forEach(select => {
        select.addEventListener('change', function() {
            updateSelectTitle(this);
        });
        
        // Also update on mouseover
        select.addEventListener('mouseenter', function() {
            updateSelectTitle(this);
        });
    });
    
    schoolSelect.addEventListener('change', function() {
        const selectedSchool = this.value;
        
        // Clear course options
        courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
        
        if (selectedSchool === 'base') {
            // For base repository, use general categories
            courseSelect.disabled = false;
            const baseCategories = [
                { value: 'general', label: 'General University Information' },
                { value: 'admissions', label: 'Admissions' },
                { value: 'examinations', label: 'Examinations' },
                { value: 'scholarships', label: 'Scholarships' },
                { value: 'hostel', label: 'Hostel & Accommodation' },
                { value: 'library', label: 'Library' },
                { value: 'sports', label: 'Sports & Recreation' },
                { value: 'campus_facilities', label: 'Campus Facilities' },
                { value: 'rules_regulations', label: 'Rules & Regulations' },
                { value: 'other', label: 'Other' }
            ];
            
            baseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.value;
                option.textContent = category.label;
                option.title = category.label;
                courseSelect.appendChild(option);
            });
        } else if (selectedSchool && coursesBySchool[selectedSchool]) {
            // Enable course select
            courseSelect.disabled = false;
            
            // Add courses for selected school
            coursesBySchool[selectedSchool].forEach(course => {
                const option = document.createElement('option');
                option.value = course.value;
                option.textContent = course.label;
                option.title = course.label; // Add title for full text on hover
                courseSelect.appendChild(option);
            });
        } else {
            courseSelect.disabled = true;
        }
    });
}

// Setup file upload display
function setupFileUploadHandler() {
    const fileInput = document.getElementById('fileUpload');
    const fileDisplay = document.getElementById('fileDisplay');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit');
                fileInput.value = '';
                fileDisplay.innerHTML = '<span class="file-placeholder">No file selected</span>';
                return;
            }
            
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            fileDisplay.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize} MB</span>
            `;
        } else {
            fileDisplay.innerHTML = '<span class="file-placeholder">No file selected</span>';
        }
    });
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');
        
        // Validate file
        const fileInput = document.getElementById('fileUpload');
        if (!fileInput.files[0]) {
            alert('Please select a PDF file to upload');
            return;
        }
        
        // Get form values
        const school = document.getElementById('schoolSelect').value;
        const course = document.getElementById('courseSelect').value;
        const documentTitle = document.getElementById('documentTitle').value;
        const documentType = document.getElementById('documentType').value;
        const academicYear = document.getElementById('academicYear').value;
        const description = document.getElementById('description').value;
        
        // Validation
        if (!school || !course || !documentTitle || !documentType) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create FormData with correct field names
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('school', school);
        formData.append('course', course);
        formData.append('documentTitle', documentTitle);
        formData.append('documentType', documentType);
        if (academicYear) {
            formData.append('academicYear', academicYear);
        }
        if (description) {
            formData.append('description', description);
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Uploading...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                alert('Document uploaded successfully!');
                form.reset();
                document.getElementById('fileDisplay').innerHTML = '<span class="file-placeholder">No file selected</span>';
                document.getElementById('courseSelect').disabled = true;
                document.getElementById('courseSelect').innerHTML = '<option value="">-- Select School First --</option>';
                loadUploadedDocuments();
            } else {
                alert(data.message || 'Failed to upload document. Please try again.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Network error. Please check if the server is running.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Upload Document';
        }
    });
}

// Load uploaded documents
async function loadUploadedDocuments() {
    const documentsList = document.getElementById('documentsList');
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.documents && data.documents.length > 0) {
                displayDocuments(data.documents);
            } else {
                documentsList.innerHTML = `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        <p>No documents uploaded yet</p>
                        <small>Upload your first document to get started</small>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        // Keep empty state on error
    }
}

// Display documents list
function displayDocuments(documents) {
    const documentsList = document.getElementById('documentsList');
    
    // Helper function to format school name
    function formatSchoolName(school) {
        const schoolNames = {
            'base': 'KRMU (General University Documents)',
            'soet': 'School of Engineering & Technology',
            'som': 'School of Management',
            'sol': 'School of Law',
            'soa': 'School of Architecture',
            'sohss': 'School of Humanities & Social Sciences',
            'sopa': 'School of Performing Arts',
            'soe': 'School of Education',
            'soph': 'School of Pharmacy',
            'soc': 'School of Commerce'
        };
        return schoolNames[school] || school;
    }
    
    documentsList.innerHTML = documents.map(doc => `
        <div class="document-card">
            <div class="document-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
            </div>
            <div class="document-info">
                <h3>${doc.document_title || doc.original_filename}</h3>
                <p class="document-meta">
                    <span>${formatSchoolName(doc.school)}</span> • 
                    <span>${doc.document_type || 'N/A'}</span>
                    ${doc.academic_year ? ` • <span>${doc.academic_year}</span>` : ''}
                </p>
                <p class="document-date">Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}</p>
            </div>
            <div class="document-actions">
                <button class="action-btn delete-btn" onclick="deleteDocument('${doc.id}')" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Delete document
async function deleteDocument(documentId) {
    if (!confirm('Are you sure you want to delete this document?')) {
        return;
    }
    
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            alert('Document deleted successfully');
            loadUploadedDocuments();
        } else {
            alert(data.message || 'Failed to delete document');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Network error. Please try again.');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('registrarData');
        window.location.href = '/index.html';
    }
}
