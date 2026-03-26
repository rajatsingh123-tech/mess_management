const express = require('express');
const router = express.Router();
const FoodMenu = require('../models/FoodMenu');

// GET /api/menu - Get current month's menu
router.get('/', async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();
        
        let menu = await FoodMenu.findOne({ month: currentMonth, year: currentYear });
        
        if (!menu) {
            // Return default menu if not found
            return res.status(200).json({
                success: true,
                message: 'No menu set for this month',
                menu: null,
                month: currentMonth,
                year: currentYear
            });
        }
        
        res.status(200).json({
            success: true,
            menu: menu
        });
        
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/menu - Create or update menu
router.post('/', async (req, res) => {
    try {
        const { month, year, menuItems } = req.body;
        
        // Check if menu exists for this month
        let existingMenu = await FoodMenu.findOne({ month, year });
        
        if (existingMenu) {
            // Update existing menu
            existingMenu.menuItems = menuItems;
            existingMenu.updatedAt = Date.now();
            await existingMenu.save();
            res.status(200).json({
                success: true,
                message: 'Menu updated successfully!',
                menu: existingMenu
            });
        } else {
            // Create new menu
            const newMenu = new FoodMenu({
                month,
                year,
                menuItems
            });
            await newMenu.save();
            res.status(201).json({
                success: true,
                message: 'Menu created successfully!',
                menu: newMenu
            });
        }
        
    } catch (error) {
        console.error('Error saving menu:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/menu/:id - Delete a menu
router.delete('/:id', async (req, res) => {
    try {
        const deletedMenu = await FoodMenu.findByIdAndDelete(req.params.id);
        
        if (!deletedMenu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Menu deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting menu:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/menu/all - Get all menus (for admin)
router.get('/all', async (req, res) => {
    try {
        const menus = await FoodMenu.find().sort({ year: -1, month: -1 });
        res.status(200).json({
            success: true,
            menus: menus
        });
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;