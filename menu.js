const API_URL = 'http://localhost:5000/api/menu';
let currentMenu = null;
let isEditing = false;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Load menu when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});

async function loadMenu() {
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearInput').value;
    
    try {
        const response = await fetch(`${API_URL}?month=${month}&year=${year}`);
        const data = await response.json();
        
        if (data.menu) {
            currentMenu = data.menu;
            displayMenu(currentMenu.menuItems);
        } else {
            displayNoMenu();
        }
        
        document.getElementById('editMenuForm').style.display = 'none';
        isEditing = false;
        
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuDisplay').innerHTML = '<div class="error">Failed to load menu</div>';
    }
}

function displayMenu(menuItems) {
    let html = '<div class="menu-table"><table><thead><tr>';
    html += '<th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th>';
    html += '</tr></thead><tbody>';
    
    menuItems.forEach(item => {
        html += `
            <tr>
                <td><strong>${item.day}</strong></td>
                <td>${item.breakfast}</td>
                <td>${item.lunch}</td>
                <td>${item.dinner}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    document.getElementById('menuDisplay').innerHTML = html;
}

function displayNoMenu() {
    document.getElementById('menuDisplay').innerHTML = `
        <div class="no-menu">
            <p>No menu set for this month.</p>
            <p>Click "Edit Menu" to create one!</p>
        </div>
    `;
}

function enableEditing() {
    isEditing = true;
    document.getElementById('editMenuForm').style.display = 'block';
    
    let editorHtml = '';
    days.forEach(day => {
        const existingItem = currentMenu?.menuItems?.find(item => item.day === day);
        
        editorHtml += `
            <div class="menu-edit-item">
                <h4>${day}</h4>
                <div class="form-group">
                    <label>Breakfast:</label>
                    <input type="text" id="breakfast_${day}" value="${existingItem?.breakfast || ''}" 
                           placeholder="e.g., Idli, Sambhar, Chutney">
                </div>
                <div class="form-group">
                    <label>Lunch:</label>
                    <input type="text" id="lunch_${day}" value="${existingItem?.lunch || ''}"
                           placeholder="e.g., Roti, Dal, Sabzi, Rice">
                </div>
                <div class="form-group">
                    <label>Dinner:</label>
                    <input type="text" id="dinner_${day}" value="${existingItem?.dinner || ''}"
                           placeholder="e.g., Roti, Paneer, Rice, Salad">
                </div>
            </div>
        `;
    });
    
    document.getElementById('menuEditor').innerHTML = editorHtml;
}

async function saveMenu() {
    const month = document.getElementById('monthSelect').value;
    const year = parseInt(document.getElementById('yearInput').value);
    
    const menuItems = [];
    
    days.forEach(day => {
        const breakfast = document.getElementById(`breakfast_${day}`).value;
        const lunch = document.getElementById(`lunch_${day}`).value;
        const dinner = document.getElementById(`dinner_${day}`).value;
        
        if (breakfast || lunch || dinner) {
            menuItems.push({
                day,
                breakfast: breakfast || 'Not specified',
                lunch: lunch || 'Not specified',
                dinner: dinner || 'Not specified'
            });
        }
    });
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                month,
                year,
                menuItems
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Menu saved successfully!');
            loadMenu();
        } else {
            alert('Error: ' + data.message);
        }
        
    } catch (error) {
        console.error('Error saving menu:', error);
        alert('Failed to save menu');
    }
}