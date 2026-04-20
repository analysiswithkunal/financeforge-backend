// routes/valuation.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import your Valuation model (Created in Step 1)
const Valuation = require('../models/valuation');

// Middleware to verify the user's secure token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// POST 
router.post('/dcf', (req, res) => {
    try {
        // 1. Grab inputs from the frontend
        const { startingCashFlow, growthRate, discountRate, years } = req.body;

        // Convert percentages to decimals
        const g = growthRate / 100;
        const r = discountRate / 100;

        let totalIntrinsicValue = 0;
        let yearlyProjections = [];
        let currentCashFlow = startingCashFlow;

        // 2. Loop through each year to calculate future cash flows and present value
        for (let t = 1; t <= years; t++) {
            // Grow the cash flow
            currentCashFlow = currentCashFlow * (1 + g);
            
            // Discount it back to Present Value
            const presentValue = currentCashFlow / Math.pow((1 + r), t);
            
            // Add to our running total
            totalIntrinsicValue += presentValue;

            // Save the data for this specific year to show the user
            yearlyProjections.push({
                year: t,
                projectedCashFlow: currentCashFlow.toFixed(2),
                presentValue: presentValue.toFixed(2)
            });
        }

        // 3. Send the final valuation back to the frontend
        res.status(200).json({
            message: 'DCF Calculated Successfully',
            totalIntrinsicValue: totalIntrinsicValue.toFixed(2),
            projections: yearlyProjections
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating DCF' });
    }
});
// GET 
router.get('/history', verifyToken, async (req, res) => {
    try {
        // Find all valuations linked to this specific user's ID and sort by newest first
        const savedValuations = await Valuation.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(savedValuations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

module.exports = router;