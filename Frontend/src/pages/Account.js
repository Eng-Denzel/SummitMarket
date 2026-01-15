import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import './Account.css';

const Account = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      username: user?.username || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // In a real app, you would call an API to update user info
      updateUser({ ...user, ...data });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="account-title">My Account</h1>

        <div className="account-layout">
          <motion.div
            className="account-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-header">
              <h2>Profile Information</h2>
              <p>Update your account details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input
                      id="first_name"
                      type="text"
                      {...register('first_name', { required: 'First name is required' })}
                      className={errors.first_name ? 'input-error' : ''}
                    />
                  </div>
                  {errors.first_name && (
                    <span className="error-message">{errors.first_name.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input
                      id="last_name"
                      type="text"
                      {...register('last_name', { required: 'Last name is required' })}
                      className={errors.last_name ? 'input-error' : ''}
                    />
                  </div>
                  {errors.last_name && (
                    <span className="error-message">{errors.last_name.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    {...register('username')}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <p className="input-help">Username cannot be changed</p>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={errors.email ? 'input-error' : ''}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              <Button type="submit" fullWidth loading={loading}>
                Update Profile
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="account-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card-header">
              <h2>Change Password</h2>
              <p>Update your password</p>
            </div>

            <div className="password-section">
              <div className="form-group">
                <label htmlFor="current_password">Current Password</label>
                <div className="input-with-icon">
                  <FiLock className="input-icon" />
                  <input
                    id="current_password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <div className="input-with-icon">
                  <FiLock className="input-icon" />
                  <input
                    id="new_password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>
                <div className="input-with-icon">
                  <FiLock className="input-icon" />
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button fullWidth variant="secondary">
                Change Password
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
