import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Form, Spinner, ListGroup, Alert } from 'react-bootstrap';
import axios from "../../api/axiosInstance";
import { useNavigate } from 'react-router-dom';
import InvoicePrint from './InvoicePrint';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Стани для модальних вікон
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);

    // Стани для контрагентів
    const [contractors, setContractors] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [filteredBuyers, setFilteredBuyers] = useState([]);
    const [supplierSearch, setSupplierSearch] = useState('');
    const [buyerSearch, setBuyerSearch] = useState('');
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);

    // Стани для замовлень
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Стани для вибраних контрагентів
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedBuyer, setSelectedBuyer] = useState(null);

    // Стан для друку рахунку
    const [printInvoice, setPrintInvoice] = useState(null);
    const [printLoading, setPrintLoading] = useState(false);

    // Поточний рахунок для операцій
    const [currentInvoice, setCurrentInvoice] = useState(null);

    // Форма для створення/редагування рахунку
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        supplierId: '',
        supplierName: '',
        buyerId: '',
        buyerName: '',
        totalSum: '',
        items: []
    });

    // Завантаження списку рахунків при ініціалізації компонента
    useEffect(() => {
        fetchInvoices();
        fetchContractors();
    }, []);

    // Функція для отримання списку рахунків
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/invoices');
            setInvoices(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при завантаженні рахунків');
            setLoading(false);
        }
    };

    // Функція для отримання списку контрагентів
    const fetchContractors = async () => {
        try {
            const response = await axios.get('/api/invoices/contractors/all');
            setContractors(response.data);
            setFilteredSuppliers(response.data);
            setFilteredBuyers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при завантаженні контрагентів');
        }
    };

    // Функція для отримання списку замовлень
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/orders/all', {
                currentPage: 1,
                inPageCount: 100,
                columnName: { column: 'id', reverse: true },
                search: '',
                statuses: { status3: true } // Тільки завершені замовлення
            });
            setOrders(response.data.rows);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при завантаженні замовлень');
            setLoading(false);
        }
    };

    // Функція для створення рахунку з замовлення
    const createInvoiceFromOrder = async (orderId) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/invoices/from-order/${orderId}`, {
                supplierId: selectedSupplier ? selectedSupplier.id : null,
                buyerId: selectedBuyer ? selectedBuyer.id : null
            });
            setInvoices([response.data, ...invoices]);
            setSuccess('Рахунок успішно створено з замовлення');
            setShowOrderModal(false);
            setSelectedSupplier(null);
            setSelectedBuyer(null);
            setSelectedOrder(null);
            setLoading(false);

            // Очищаємо повідомлення про успіх через 3 секунди
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при створенні рахунку з замовлення');
            setLoading(false);
        }
    };

    // Функція для створення нового рахунку
    const handleCreateInvoice = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/invoices', formData);
            setInvoices([response.data, ...invoices]);
            setShowAddModal(false);
            setFormData({
                invoiceNumber: '',
                invoiceDate: new Date().toISOString().split('T')[0],
                supplierId: '',
                supplierName: '',
                buyerId: '',
                buyerName: '',
                totalSum: '',
                items: []
            });
            setSuccess('Рахунок успішно створено');
            setLoading(false);

            // Очищаємо повідомлення про успіх через 3 секунди
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при створенні рахунку');
            setLoading(false);
        }
    };

    // Функція для видалення рахунку
    const handleDeleteInvoice = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/invoices/${currentInvoice.id}`);
            setInvoices(invoices.filter(invoice => invoice.id !== currentInvoice.id));
            setShowDeleteModal(false);
            setSuccess('Рахунок успішно видалено');
            setLoading(false);

            // Очищаємо повідомлення про успіх через 3 секунди
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Помилка при видаленні рахунку');
            setLoading(false);
        }
    };

    // Функція для друку рахунку
    const handlePrintInvoice = async () => {
        try {
            setPrintLoading(true);
            const response = await axios.post(`/api/invoices/${printInvoice.id}/document`, {}, {
                responseType: 'blob'
            });

            // Створюємо посилання для завантаження файлу
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${printInvoice.invoiceNumber}.docx`);
            document.body.appendChild(link);
            link.click();

            // Очищаємо
            setPrintLoading(false);
            setPrintInvoice(null);
        } catch (err) {
            setError('Помилка при генерації документу');
            setPrintLoading(false);
        }
    };

    // Обробник відкриття модального вікна для створення рахунку з замовлення
    const handleOpenOrderModal = () => {
        fetchOrders();
        setShowOrderModal(true);
    };

    // Обробник вибору замовлення
    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    // Рендеринг компонента
    return (
        <div className="container mt-4">
            <h2>Список рахунків</h2>

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
                <Button variant="primary" onClick={() => setShowAddModal(true)} className="me-2">
                    Створити рахунок
                </Button>
                <Button variant="success" onClick={handleOpenOrderModal}>
                    Створити рахунок з замовлення
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
                            <th>Номер рахунку</th>
                            <th>Дата</th>
                            <th>Постачальник</th>
                            <th>Покупець</th>
                            <th>Сума</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td>{invoice.id}</td>
                                    <td>{invoice.invoiceNumber}</td>
                                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                    <td>{invoice.supplierName}</td>
                                    <td>{invoice.buyerName}</td>
                                    <td>{invoice.totalSum} грн</td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-1"
                                            onClick={() => {
                                                setCurrentInvoice(invoice);
                                                setShowViewModal(true);
                                            }}
                                        >
                                            Перегляд
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="me-1"
                                            onClick={() => {
                                                setPrintInvoice(invoice);
                                            }}
                                        >
                                            Друк
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => {
                                                setCurrentInvoice(invoice);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Немає рахунків</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Модальне вікно для перегляду рахунку */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Перегляд рахунку</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentInvoice && (
                        <div>
                            <h5>Основна інформація</h5>
                            <p><strong>Номер рахунку:</strong> {currentInvoice.invoiceNumber}</p>
                            <p><strong>Дата:</strong> {new Date(currentInvoice.invoiceDate).toLocaleDateString()}</p>
                            <p><strong>Постачальник:</strong> {currentInvoice.supplierName}</p>
                            <p><strong>Покупець:</strong> {currentInvoice.buyerName}</p>
                            <p><strong>Загальна сума:</strong> {currentInvoice.totalSum} грн</p>

                            <h5 className="mt-4">Товари/послуги</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Найменування</th>
                                        <th>Од. вим.</th>
                                        <th>Кількість</th>
                                        <th>Ціна</th>
                                        <th>Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInvoice.items && currentInvoice.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price} грн</td>
                                            <td>{item.total} грн</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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
                            setPrintInvoice(currentInvoice);
                            setShowViewModal(false);
                        }}
                    >
                        Друкувати
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальне вікно для видалення рахунку */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Видалення рахунку</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentInvoice && (
                        <p>Ви впевнені, що хочете видалити рахунок #{currentInvoice.invoiceNumber}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteInvoice}
                        disabled={loading}
                    >
                        {loading ? 'Видалення...' : 'Видалити'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальне вікно для створення рахунку з замовлення */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Створення рахунку з замовлення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Завантаження...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <p>Виберіть замовлення для створення рахунку:</p>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Клієнт</th>
                                        <th>Сума</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map(order => (
                                            <tr key={order.id} className={selectedOrder?.id === order.id ? 'table-primary' : ''}>
                                                <td>{order.id}</td>
                                                <td>{order.client ? `${order.client.lastName || ''} ${order.client.firstName || ''}`.trim() : 'Невідомий клієнт'}</td>
                                                <td>{order.price} грн</td>
                                                <td>
                                                    <Button 
                                                        variant={selectedOrder?.id === order.id ? "success" : "outline-primary"} 
                                                        size="sm"
                                                        onClick={() => handleSelectOrder(order)}
                                                    >
                                                        {selectedOrder?.id === order.id ? "Вибрано" : "Вибрати"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">Немає доступних замовлень</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            {selectedOrder && (
                                <div className="mt-4">
                                    <h5>Виберіть контрагентів для рахунку:</h5>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Постачальник</Form.Label>
                                        <Form.Select 
                                            value={selectedSupplier?.id || ''}
                                            onChange={(e) => {
                                                const supplierId = e.target.value;
                                                if (supplierId) {
                                                    const supplier = contractors.find(c => c.id === parseInt(supplierId));
                                                    setSelectedSupplier(supplier);
                                                } else {
                                                    setSelectedSupplier(null);
                                                }
                                            }}
                                        >
                                            <option value="">Виберіть постачальника (або буде використано за замовчуванням)</option>
                                            {contractors.map(contractor => (
                                                <option key={contractor.id} value={contractor.id}>
                                                    {contractor.name} {contractor.isDefault ? '(За замовчуванням)' : ''}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Покупець</Form.Label>
                                        <Form.Select 
                                            value={selectedBuyer?.id || ''}
                                            onChange={(e) => {
                                                const buyerId = e.target.value;
                                                if (buyerId) {
                                                    const buyer = contractors.find(c => c.id === parseInt(buyerId));
                                                    setSelectedBuyer(buyer);
                                                } else {
                                                    setSelectedBuyer(null);
                                                }
                                            }}
                                        >
                                            <option value="">Виберіть покупця (або буде створено на основі даних клієнта)</option>
                                            {contractors.map(contractor => (
                                                <option key={contractor.id} value={contractor.id}>
                                                    {contractor.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => createInvoiceFromOrder(selectedOrder.id)}
                        disabled={loading || !selectedOrder}
                    >
                        {loading ? 'Створення...' : 'Створити рахунок'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальне вікно для друку рахунку */}
            <InvoicePrint 
                show={!!printInvoice} 
                onHide={() => setPrintInvoice(null)} 
                invoice={printInvoice} 
                loading={printLoading}
                onPrint={handlePrintInvoice}
            />
        </div>
    );
};

export default InvoiceList;
