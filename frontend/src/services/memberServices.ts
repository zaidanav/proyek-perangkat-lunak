const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { FormDataMember, FormErrors } from '@/types/MemberForm'

export const getMember = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/get-member');
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const deleteMemberById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-member/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Gagal menghapus member');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting member:', error);
    return null;
  }
};

export const addNewMember = async (
  formData: FormDataMember,
  errors: FormErrors,
  apiError: { value: string | null },
  isSubmitting: { value: boolean },
  formSubmitted: { value: boolean }
) => {
  try {
    const form = new FormData()
    form.append('username', formData.username)
    form.append('name', formData.name)
    form.append('email', formData.email)
    form.append('role', formData.role)
    if (formData.img_file) {
      form.append('img_file', formData.img_file);
    }
    if (formData.phone) {
      form.append('phone', formData.phone);
    }
    const response = await fetch(`${API_BASE_URL}/add-member`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    })

    const data = await response.json()
    
    if (!response.ok) {
      let erroMessage = ""
      if (data.message) {
        erroMessage = data.message || 'Validation error. Please check your input.'
      } 
      else {
        erroMessage = 'An unexpected error occurred. Please try again.'
      }

      throw new Error(erroMessage)
    } else {
      formSubmitted.value = true
      formData.name = ''
      formData.img_file = null
      formData.email = ''
      formData.phone = ''
    }
    return data;
  } catch (error) {
    throw error
  }
}


export const updateUserData = async (id: number, name: string, phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-member/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone_no }),
    });
    if (!response.ok) {
      throw new Error('Gagal mengupdate member');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating member:', error);
    return null;
  }
};

export const getProfileUsers = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/profile', {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export const updateProfile = async (username:string, name: string, img_file: File | null, phone_no: string) => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    if (img_file) {
      formData.append('img_file', img_file);
    }
    formData.append('phone_no', phone_no);
    
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

export const checkPhoneNumber = async (phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-phone`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_no }),
      credentials: 'include'
    });
    if (response.status >= 500) {
      throw new Error('Gagal mengecek nomor telepon');
    }
    const data = await response.json();
    return data.isUsed;
  } catch (error) {
    console.error('Error checking phone number:', error);
    return null;
  }
}

export const getMemberById = async (memberId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-member/${memberId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: 'include'
    });

    // handler password lama salah
    if (response.status === 400) {
      throw new Error('Password lama salah');
    } else if (!response.ok) {
      throw new Error('Gagal mengubah password');
    }

    return await response.json();
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}