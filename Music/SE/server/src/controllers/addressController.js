const { Address } = require('../models');

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, addressLine, city, state, pincode, country = 'India', isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Please provide all required address fields' });
    }

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false
    });

    res.status(201).json({
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Server error creating address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { fullName, phone, addressLine, city, state, pincode, country, isDefault } = req.body;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await address.save();

    res.status(200).json({
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error updating address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.destroy();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error deleting address' });
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
