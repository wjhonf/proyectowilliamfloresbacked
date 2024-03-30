const { Router } = require('express');
const router = Router();
router.get('/loggerTest', async (req, res) => {
   
        req.logger.fatal('Esto es fatal.');
        req.logger.error('Esto es error');
        req.logger.warning('Esto es warning');
        req.logger.info('Esto es info');
        res.json({ response: 'loggerTest' });
});

module.exports = router;
