const CriminalModel = require('../models/criminalModel');
const ActivityModel = require('../models/activityModel');

const CriminalController = {
  // Get all criminals
  getAll: async (req, res) => {
    try {
      const criminals = await CriminalModel.getAll();
      res.status(200).json(criminals);
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({ message: 'Error retrieving criminals', error: error.message });
    }
  },

  // Get single criminal
  getById: async (req, res) => {
    try {
      const criminal = await CriminalModel.getById(req.params.id);
      if (!criminal) return res.status(404).json({ message: 'Criminal not found' });
      res.status(200).json(criminal);
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({ message: 'Error retrieving criminal', error: error.message });
    }
  },

  // Add criminal
  create: async (req, res) => {
    try {
      console.log('Received body for create:', req.body);
      const {
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date, crime_date, address, age,
        occupation, birth_mark, police_station, status
      } = req.body;
      
      const criminal_photo = req.file ? `/uploads/${req.file.filename}` : null;

      const newId = await CriminalModel.create({
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date, crime_date, address, age,
        occupation, birth_mark, police_station, status, criminal_photo
      });

      // Log activity
      const userId = req.user ? req.user.id : null;
      await ActivityModel.create({
        user_id: userId,
        action: 'CREATE',
        entity_type: 'criminal',
        entity_id: newId,
        description: `Added criminal record: ${criminal_name} (Case: ${case_id || 'N/A'})`
      });

      res.status(201).json({ message: 'Criminal added successfully', id: newId });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ message: 'Error adding criminal', error: error.message });
    }
  },

  // Update criminal
  update: async (req, res) => {
    try {
      console.log('Received body for update:', req.body);
      const {
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date, crime_date, address, age,
        occupation, birth_mark, police_station, status
      } = req.body;
      
      const criminal_photo = req.file ? `/uploads/${req.file.filename}` : null;
      
      const affectedRows = await CriminalModel.update(req.params.id, {
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date, crime_date, address, age,
        occupation, birth_mark, police_station, status, criminal_photo
      });

      if (affectedRows === 0) return res.status(404).json({ message: 'Criminal not found' });

      // Log activity
      const userId = req.user ? req.user.id : null;
      await ActivityModel.create({
        user_id: userId,
        action: 'UPDATE',
        entity_type: 'criminal',
        entity_id: parseInt(req.params.id),
        description: `Updated criminal record: ${criminal_name} (Case: ${case_id || 'N/A'})`
      });

      res.status(200).json({ message: 'Criminal updated successfully' });
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ message: 'Error updating criminal', error: error.message });
    }
  },

  // Delete criminal
  delete: async (req, res) => {
    try {
      // Get criminal info before deleting for activity log
      const criminal = await CriminalModel.getById(req.params.id);
      
      const affectedRows = await CriminalModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ message: 'Criminal not found' });

      // Log activity
      const userId = req.user ? req.user.id : null;
      await ActivityModel.create({
        user_id: userId,
        action: 'DELETE',
        entity_type: 'criminal',
        entity_id: parseInt(req.params.id),
        description: `Deleted criminal record: ${criminal ? criminal.criminal_name : 'ID ' + req.params.id}`
      });

      res.status(200).json({ message: 'Criminal deleted successfully' });
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ message: 'Error deleting criminal', error: error.message });
    }
  },

  // Search
  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ message: 'Search query required' });
      
      const results = await CriminalModel.search(q);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ message: 'Error searching criminals', error: error.message });
    }
  },

  // Dashboard statistics - fully dynamic from MySQL
  getStats: async (req, res) => {
    try {
      const stats = await CriminalModel.getStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ message: 'Error retrieving statistics', error: error.message });
    }
  }
};

module.exports = CriminalController;
