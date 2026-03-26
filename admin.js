const API_URL = 'http://localhost:5000/api/feedback';

async function loadFeedback() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalFeedbacks').textContent = data.count;
            document.getElementById('averageRating').textContent = data.averageRating;
            displayFeedbackTable(data.feedbacks);
        } else {
            showError('Failed to load feedback data');
        }
        
    } catch (error) {
        console.error('Error loading feedback:', error);
        showError('Failed to connect to server.');
    }
}

function displayFeedbackTable(feedbacks) {
    const tableBody = document.getElementById('feedbackTableBody');
    
    if (feedbacks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No feedback submitted yet</td></tr>';
        return;
    }
    
    let html = '';
    feedbacks.forEach(feedback => {
        const stars = '★'.repeat(feedback.foodRating) + '☆'.repeat(5 - feedback.foodRating);
        const date = new Date(feedback.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let sentimentClass = '';
        if (feedback.sentiment === 'Positive') sentimentClass = 'sentiment-positive';
        else if (feedback.sentiment === 'Negative') sentimentClass = 'sentiment-negative';
        else sentimentClass = 'sentiment-neutral';
        
        html += `
            <tr>
                <td>${escapeHtml(feedback.studentName)}</td>
                <td>${escapeHtml(feedback.hostelRoomNumber)}</td>
                <td><span class="rating-stars">${stars}</span></td>
                <td>${escapeHtml(feedback.feedbackText)}</td>
                <td><span class="${sentimentClass}">${feedback.sentiment}</span></td>
                <td>${date}</td>
                <td>
                    <button onclick="deleteFeedback('${feedback._id}')" class="delete-btn">🗑️ Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// NEW: Delete feedback function
async function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Feedback deleted successfully!');
                loadFeedback(); // Refresh the table
            } else {
                alert('Error: ' + data.message);
            }
            
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Failed to delete feedback');
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const tableBody = document.getElementById('feedbackTableBody');
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">${message}</td></tr>`;
}

// Auto-refresh every 30 seconds
document.addEventListener('DOMContentLoaded', () => {
    loadFeedback();
    setInterval(loadFeedback, 30000);
});