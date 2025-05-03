import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import axios from "../../api/axiosInstance";

const ContractorList = () => {
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // States for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Current contractor for operations
    const [currentContractor, setCurrentContractor] = useState(null);

    // Form data for creating/editing contractor
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        bankName: '',
        iban: '',
        edrpou: '',
        email: '',
        phone: '',
        taxSystem: '',
        comment: '',
        isDefault: false
    });

    // Load contractors on component initialization
    useEffect(() => {
        fetchContractors();
    }, []);

    // Function to fetch contractors
    const fetchContractors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/counterparties');
            setContractors(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при завантаженні контрагентів');
            setLoading(false);
        }
    };

    // Function to create a new contractor
    const handleCreateContractor = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/counterparties', formData);
            setContractors([...contractors, response.data]);
            setShowAddModal(false);
            resetForm();
            setSuccess('Контрагента успішно створено');
            setLoading(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при створенні контрагента');
            setLoading(false);
        }
    };

    // Function to update a contractor
    const handleUpdateContractor = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/counterparties/${currentContractor.id}`, formData);
            setContractors(contractors.map(c => c.id === currentContractor.id ? response.data : c));
            setShowEditModal(false);
            resetForm();
            setSuccess('Контрагента успішно оновлено');
            setLoading(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при оновленні контрагента');
            setLoading(false);
        }
    };

    // Function to delete a contractor
    const handleDeleteContractor = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/counterparties/${currentContractor.id}`);
            setContractors(contractors.filter(c => c.id !== currentContractor.id));
            setShowDeleteModal(false);
            setSuccess('Контрагента успішно видалено');
            setLoading(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при видаленні контрагента');
            setLoading(false);
        }
    };

    // Function to open edit modal with contractor data
    const openEditModal = (contractor) => {
        setCurrentContractor(contractor);
        setFormData({
            name: contractor.name || '',
            address: contractor.address || '',
            bankName: contractor.bankName || '',
            iban: contractor.iban || '',
            edrpou: contractor.edrpou || '',
            email: contractor.email || '',
            phone: contractor.phone || '',
            taxSystem: contractor.taxSystem || '',
            comment: contractor.comment || '',
            isDefault: contractor.isDefault || false
        });
        setShowEditModal(true);
    };

    // Function to open view modal with contractor data
    const openViewModal = (contractor) => {
        setCurrentContractor(contractor);
        setShowViewModal(true);
    };

    // Function to open delete modal with contractor data
    const openDeleteModal = (contractor) => {
        setCurrentContractor(contractor);
        setShowDeleteModal(true);
    };

    // Function to reset form data
    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            bankName: '',
            iban: '',
            edrpou: '',
            email: '',
            phone: '',
            taxSystem: '',
            comment: '',
            isDefault: false
        });
    };

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="container mt-4">
            <h2>Список контрагентів</h2>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    {success}
                </Alert>
            )}

            <div className="mb-3">
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Додати контрагента
                </Button>
            </div>

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Завантаження...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Назва</th>
                            <th>ЄДРПОУ</th>
                            <th>Система оподаткування</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contractors.length > 0 ? (
                            contractors.map(contractor => (
                                <tr key={contractor.id}>
                                    <td>{contractor.id}</td>
                                    <td>{contractor.name}</td>
                                    <td>{contractor.edrpou || '—'}</td>
                                    <td>{contractor.taxSystem || '—'}</td>
                                    <td>{contractor.phone || '—'}</td>
                                    <td>{contractor.email || '—'}</td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-1"
                                            onClick={() => openViewModal(contractor)}
                                        >
                                            Перегляд
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="me-1"
                                            onClick={() => openEditModal(contractor)}
                                        >
                                            Редагувати
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => openDeleteModal(contractor)}
                                        >
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Немає контрагентів</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Modal for adding a new contractor */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Додати контрагента</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Адреса</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва банку</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="bankName" 
                                value={formData.bankName} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IBAN</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="iban" 
                                value={formData.iban} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ЄДРПОУ</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="edrpou" 
                                value={formData.edrpou} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Система оподаткування</Form.Label>
                            <Form.Select 
                                name="taxSystem" 
                                value={formData.taxSystem} 
                                onChange={handleInputChange}
                            >
                                <option value="">Виберіть систему оподаткування</option>
                                <option value="загальна система без ПДВ">Загальна система без ПДВ</option>
                                <option value="загальна система із ПДВ">Загальна система із ПДВ</option>
                                <option value="1 група">1 група</option>
                                <option value="2 група">2 група</option>
                                <option value="3 група">3 група</option>
                                <option value="3 група із ПДВ">3 група із ПДВ</option>
                                <option value="4 група">4 група</option>
                                <option value="Дія.Сіті">Дія.Сіті</option>
                                <option value="Неприбуткова організація">Неприбуткова організація</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Коментар</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="comment" 
                                value={formData.comment} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="checkbox" 
                                label="За замовчуванням" 
                                name="isDefault" 
                                checked={formData.isDefault} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleCreateContractor}
                        disabled={loading || !formData.name}
                    >
                        {loading ? 'Створення...' : 'Створити'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for editing a contractor */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Редагувати контрагента</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Адреса</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва банку</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="bankName" 
                                value={formData.bankName} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IBAN</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="iban" 
                                value={formData.iban} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ЄДРПОУ</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="edrpou" 
                                value={formData.edrpou} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Система оподаткування</Form.Label>
                            <Form.Select 
                                name="taxSystem" 
                                value={formData.taxSystem} 
                                onChange={handleInputChange}
                            >
                                <option value="">Виберіть систему оподаткування</option>
                                <option value="загальна система без ПДВ">Загальна система без ПДВ</option>
                                <option value="загальна система із ПДВ">Загальна система із ПДВ</option>
                                <option value="1 група">1 група</option>
                                <option value="2 група">2 група</option>
                                <option value="3 група">3 група</option>
                                <option value="3 група із ПДВ">3 група із ПДВ</option>
                                <option value="4 група">4 група</option>
                                <option value="Дія.Сіті">Дія.Сіті</option>
                                <option value="Неприбуткова організація">Неприбуткова організація</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Коментар</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="comment" 
                                value={formData.comment} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="checkbox" 
                                label="За замовчуванням" 
                                name="isDefault" 
                                checked={formData.isDefault} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleUpdateContractor}
                        disabled={loading || !formData.name}
                    >
                        {loading ? 'Оновлення...' : 'Оновити'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for viewing a contractor */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Перегляд контрагента</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentContractor && (
                        <div>
                            <p><strong>Назва:</strong> {currentContractor.name}</p>
                            <p><strong>Адреса:</strong> {currentContractor.address || '—'}</p>
                            <p><strong>Назва банку:</strong> {currentContractor.bankName || '—'}</p>
                            <p><strong>IBAN:</strong> {currentContractor.iban || '—'}</p>
                            <p><strong>ЄДРПОУ:</strong> {currentContractor.edrpou || '—'}</p>
                            <p><strong>Email:</strong> {currentContractor.email || '—'}</p>
                            <p><strong>Телефон:</strong> {currentContractor.phone || '—'}</p>
                            <p><strong>Система оподаткування:</strong> {currentContractor.taxSystem || '—'}</p>
                            <p><strong>Коментар:</strong> {currentContractor.comment || '—'}</p>
                            <p><strong>За замовчуванням:</strong> {currentContractor.isDefault ? 'Так' : 'Ні'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Закрити
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            setShowViewModal(false);
                            openEditModal(currentContractor);
                        }}
                    >
                        Редагувати
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for deleting a contractor */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Видалення контрагента</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentContractor && (
                        <p>Ви впевнені, що хочете видалити контрагента "{currentContractor.name}"?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteContractor}
                        disabled={loading}
                    >
                        {loading ? 'Видалення...' : 'Видалити'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContractorList;