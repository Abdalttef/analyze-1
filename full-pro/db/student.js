// studnts model (New)
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
      // New fields
      class_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: true
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true
      },
      month: {
        type: DataTypes.STRING,
        allowNull: true
      },
      student_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      student_number: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_absent: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      absent: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      dynamic_data: {
        type: DataTypes.JSON, 
        allowNull: true
      },
      // Adding fields for days 1 to 30
      day_1: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_2: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_3: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_4: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_5: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_6: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_7: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_8: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_9: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_10: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_11: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_12: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_13: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_14: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_15: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_16: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_17: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_18: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_19: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_20: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_21: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_22: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_23: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_24: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_25: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_26: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_27: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_28: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_29: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      day_30: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      tableName: 'students',
      timestamps: false
    });
  
    return Student;
};