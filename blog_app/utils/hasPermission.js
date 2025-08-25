
import Permission from "../models/permission.model.js";


async function hasPermission(roleId,permissionName){
    const response = await Permission.findOne({where:{
        roleId,
        name:permissionName
    }});
    return response;
}

export default hasPermission;