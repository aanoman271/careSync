"use client";

import Swal from "sweetalert2";

const useSweetAlert = () => {
  // Success Alert
  const successAlert = ({
    title = "Success!",
    text = "",
    timer = 2000,
  } = {}) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      timer,
      showConfirmButton: false,
    });
  };

  // Error Alert
  const errorAlert = ({ title = "Error!", text = "" } = {}) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
    });
  };

  // Warning Alert
  const warningAlert = ({ title = "Warning!", text = "" } = {}) => {
    return Swal.fire({
      icon: "warning",
      title,
      text,
    });
  };

  // Confirm Alert
  const confirmAlert = async ({
    title = "Are you sure?",
    text = "",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
  } = {}) => {
    const result = await Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });

    return result.isConfirmed;
  };

  // Loading Alert
  const loadingAlert = ({
    title = "Loading...",
    text = "Please wait",
  } = {}) => {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // Close Alert
  const closeAlert = () => {
    Swal.close();
  };

  // Toast
  const toastAlert = ({
    icon = "success",
    title = "",
    position = "top-end",
  } = {}) => {
    return Swal.fire({
      toast: true,
      position,
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return {
    successAlert,
    errorAlert,
    warningAlert,
    confirmAlert,
    loadingAlert,
    closeAlert,
    toastAlert,
  };
};

export default useSweetAlert;
