import Modal from "../Modal";

export default function UpdateUserDetailsForm ({ updateUser, closeModal}) {
    return (
        <Modal show={updateUser} onClose={closeModal}>

        </Modal>
    );
}