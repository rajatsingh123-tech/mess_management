const API_URL = 'http://localhost:5000/api/feedback';
const MENU_API_URL = 'http://localhost:5000/api/menu';

const feedbackForm = document.getElementById('feedbackForm');
const messageDiv = document.getElementById('message');

// Load today's menu when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTodayMenu();
});

async function loadTodayMenu() {
    try {
        const response = await fetch(MENU_API_URL);
        const data = await response.json();
        
        const menuPreview = document.getElementById('menuPreview');
        
        if (data.menu) {
            const today = new Date();
            const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
            const todayMenu = data.menu.menuItems.find(item => item.day === todayName);
            
            if (todayMenu) {
                menuPreview.innerHTML = `
                    <div class="menu-preview">
                        <p><strong>Breakfast:</strong> ${todayMenu.breakfast}</p>
                        <p><strong>Lunch:</strong> ${todayMenu.lunch}</p>
                        <p><strong>Dinner:</strong> ${todayMenu.dinner}</p>
                    </div>
                `;
            } else {
                menuPreview.innerHTML = '<p>No menu set for today. Please check the full menu page.</p>';
            }
        } else {
            menuPreview.innerHTML = '<p>No menu set for this month. Admin will update soon.</p>';
        }
        
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuPreview').innerHTML = '<p>Unable to load today\'s menu</p>';
    }
}

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentName = document.getElementById('studentName').value;
    const hostelRoomNumber = document.getElementById('hostelRoomNumber').value;
    const menuItem = document.getElementById('menuItem').value;
    const foodRating = document.querySelector('input[name="foodRating"]:checked');
    const feedbackText = document.getElementById('feedbackText').value;
    
    if (!foodRating) {
        showMessage('Please select a rating!', 'error');
        return;
    }
    
    const feedbackData = {
        studentName: studentName,
        hostelRoomNumber: hostelRoomNumber,
        menuItem: menuItem,
        foodRating: parseInt(foodRating.value),
        feedbackText: feedbackText
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('✅ Feedback submitted successfully! Thank you for your feedback.', 'success');
            feedbackForm.reset();
            document.querySelectorAll('input[name="foodRating"]').forEach(radio => {
                radio.checked = false;
            });
        } else {
            showMessage('❌ Error: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showMessage('❌ Failed to submit feedback. Please check if server is running.', 'error');
    }
});

function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}