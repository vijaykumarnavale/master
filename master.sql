CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'User') DEFAULT 'User',
    reset_token VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    apn VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    zoning VARCHAR(100) NOT NULL,
    plot_area_sqft DECIMAL(10, 2) NOT NULL,
    height_limit_ft DECIMAL(10, 2) NOT NULL,
    depth_ft DECIMAL(10, 2) NOT NULL,
    width_ft DECIMAL(10, 2) NOT NULL,
    building_sqft DECIMAL(10, 2) NOT NULL
);


CREATE TABLE Setbacks (
    setback_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    front_ft DECIMAL(10, 2) NOT NULL,
    back_ft DECIMAL(10, 2) NOT NULL,
    side_ft DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);


CREATE TABLE lot_zoning_details (
    lot_zoning_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    zoning_type VARCHAR(100) NOT NULL,
    use_type VARCHAR(100) NOT NULL,
    lot_area_sqft DECIMAL(10, 2) NOT NULL,
    lot_width_ft DECIMAL(10, 2) NOT NULL,
    lot_depth_ft DECIMAL(10, 2) NOT NULL,
    setback_front_ft DECIMAL(10, 2) NOT NULL,
    setback_back_ft DECIMAL(10, 2) NOT NULL,
    setback_side_ft DECIMAL(10, 2) NOT NULL,
    max_height_ft DECIMAL(10, 2) NOT NULL,
    floor_area_ratio DECIMAL(5, 2) NOT NULL,
    density_units_per_lot DECIMAL(10, 2) NOT NULL,
    parking_spaces_required INT NOT NULL,
    open_space_sqft DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);



CREATE TABLE ADU_Details (
    adu_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    adu_type VARCHAR(100) NOT NULL,
    adu_count INT NOT NULL,
    adu_max_sqft DECIMAL(10, 2) NOT NULL,
    jadu_count INT NOT NULL,
    jadu_max_sqf DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);




CREATE TABLE Parking_Requirements (
    parking_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    parking_spaces INT NOT NULL,
    Eligible_For_Bonus BOOLEAN NOT NULL,
    Bonus_Type VARCHAR(100),
    Bonus_Percentage DECIMAL(5, 2),
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);


