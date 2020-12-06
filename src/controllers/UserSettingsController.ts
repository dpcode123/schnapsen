import UserDTO from "../dto/UserDTO.js";
import SettingsRepository from "../repository/SettingsRepository.js";
import { CustomRequest, CustomResponse } from "../ts/interfaces";


export default class UserSettingsController {

    settingsRepository: SettingsRepository;

    constructor() {
        this.settingsRepository = new SettingsRepository();
    }

    

    getSettings = async (req: CustomRequest, res: CustomResponse) => {
        
        const userDTO: UserDTO = new UserDTO(req.session.passport.user);
        const cardFaceDesigns: Promise<any | undefined> = await this.settingsRepository.getCardFaceDesigns();
        const cardBackDesigns: Promise<any | undefined> = await this.settingsRepository.getCardBackDesigns();

        if (cardFaceDesigns && cardBackDesigns) {
            res.render('user-settings', {
                userdata: userDTO,
                cardFaceDesigns: cardFaceDesigns,
                cardBackDesigns: cardBackDesigns
            });
        } else {
            res.redirect('/');
        }

        
    }

    updateSettings = async (req: CustomRequest, res: CustomResponse) => {

        const userId = req.session.passport.user.id;

        // get submitted ids from request body and parse them to integer
        let cardface = parseInt(req.body.cardface, 10);
        let cardback = parseInt(req.body.cardback, 10);

        // if they are not valid set them to 1
        if(isNaN(cardface)) { cardface = 1; }
        if(isNaN(cardback)) { cardback = 1; }

        // update user in database
        const queryResult: boolean = await this.settingsRepository.updateCardBackDesigns(cardface, cardback, userId);
        
        if (queryResult) {
            // update user's session
            req.session.passport.user.cardface_design_id = cardface;
            req.session.passport.user.cardback_design_id = cardback;
        } else {
            console.log('Error updating user card design preferences');
        }

        res.redirect('/user-settings');
    }

}