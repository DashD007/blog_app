import User from "./users.model.js";
import Blog from "./blog.model.js";
import Category from "./category.model.js";
import Comment from "./comment.model.js";
import Role from "./role.model.js";
import Permission from "./permission.model.js";

export const createAssociations = () => {
    User.hasMany(Blog, { foreignKey: 'publishedBy', sourceKey:"id" });
    Blog.belongsTo(User, { foreignKey: 'publishedBy', targetKey:"id" });


    Category.hasMany(Blog, { foreignKey: 'categoryId', sourceKey:'id'});
    Blog.belongsTo(Category, { foreignKey: 'categoryId',targetKey:'id'});


    Blog.hasMany(Comment, { foreignKey: 'blogId',sourceKey:'id'});
    Comment.belongsTo(Blog, { foreignKey: 'blogId',targetKey:"id" });


    User.hasMany(Comment, { foreignKey: 'commentedBy',sourceKey:"id" });
    Comment.belongsTo(User, { foreignKey: 'commentedBy',targetKey:"id" });

    Role.hasMany(User,{ foreignKey: "roleId", sourceKey: "id" });
    User.belongsTo(Role, { foreignKey: "roleId", targetKey: "id" });

    Role.hasMany(Permission, {foreignKey: 'roleId',sourceKey: 'id'});
    Permission.belongsTo(Role,{foreignKey:'roleId' ,targetKey:"id"});
}