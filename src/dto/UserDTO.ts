export default class UserDTO {

    id: number;
    username: string;
    email: string;
    cardface_design_id: number;
    cardback_design_id: number;

    constructor(user) {
        this.id = user.id,
        this.username = user.username,
        this.email = user.email,
        this.cardface_design_id = user.cardface_design_id,
        this.cardback_design_id = user.cardback_design_id
    }
    
}