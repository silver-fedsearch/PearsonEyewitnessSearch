PearsonEyewitnessSearch module for Silver
=========================================

Add on module to get results from Pearson Eyewitness into Silver. To enable add the path to the module in the searchProviders entry in your config.js file. Also add a configuration section that looks like this:

    PearsonEyewitnessSearch: {
	limit: 10,
	apiKey: [Your API key],
	timeout: 10000,
    },
