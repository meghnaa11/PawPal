
import {institutions} from '../config/mongoCollections.js'



const institution_dashboardDataFunctions = {
    
    async institutionDashboard(institutionID){
        if(!institutionID){
            throw 'No Institution ID provided'
        }
        const institution = await institutions();
        const existing_institution = await institution.findOne({_id:institionID})
        if(!existing_institution){
            throw 'Institution Not Found'
        }
        const dashboardData = {
            name:existing_institution.name,
            services: existing_institution.services,
            address: existing_institution.address,
            city: existing_institution.city,
            state: existing_institution.state
        }
        return dashboardData;

    }
}