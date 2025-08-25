import Permission from "../models/permission.model.js";
import Role from "../models/role.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";


const seed = async() => {
    try {
        const [adminRole] = await Role.findOrCreate({where:{
            name:"admin",
        }});
    
        const hashedPassword = await bcrypt.hash('admin@123', 10);
    
        const [adminUser] = await User.findOrCreate({
            where:{
                email:"admin@gmail.com"
            },
            defaults:{
                username: 'admin',
                password: hashedPassword,
                roleId: adminRole.id
            }
        });
    
        const permissionsList = [
            'blog.create',
            'blog.update',
            'blog.delete',
            'blog.get',
            'blog.list',
            'user.create',
            'user.update',
            'user.delete',
            'user.list',
            'comment.create',
            'comment.delete',
            'comment.update',
            'category.create',
            'category.update',
            'category.delete',
            'category.list',
            'role.list',
            'role.create',
        ];
        

        const existingPermissions = await Permission.findAll({
            where: { name: permissionsList }
        });

        const existingNames = existingPermissions.map(p => p.name);

        // find missing permissions
        const missing = permissionsList.filter(p => !existingNames.includes(p));

        // bulk insert missing ones
        if (missing.length > 0) {
            await Permission.bulkCreate(
                missing.map(name => ({
                name,
                roleId: adminRole?.id
                })),
                { ignoreDuplicates: true } // MySQL/SQLite support, for Postgres no need
            );
        }

    
    } catch (error) {
        console.log("failed to seed database ",error);
    }
}

export default seed;