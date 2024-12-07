module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    klik: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.Category, {
      foreignKey: { allowNull: false },
    });

    Post.belongsTo(models.User, {
      foreignKey: { allowNull: false },
    });
  };

  return Post;
};
