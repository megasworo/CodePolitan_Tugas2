module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
        catName: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    Category.associate = (models) => {
        Category.hasMany(models.Post, {
            onDelete: 'cascade'
        })
    }

    return Category
}