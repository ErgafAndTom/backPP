import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Form, Spinner, ListGroup } from 'react-bootstrap';
import axios from "../../api/axiosInstance";
import { useNavigate } from 'react-router-dom';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Стани для модальних вікон
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Стани для контрагентів
    const [contractors, setContractors] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [filteredBuyers, setFilteredBuyers] = useState([]);
    const [supplierSearch, setSupplierSearch] = useState('');
    const [buyerSearch, setBuyerSearch] = useState('');
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
    
    // Завантаження списку контрагентів при ініціалізації компонента
    useEffect(() => {
        const fetchContractors = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/invoices/contractors/all');
                setContractors(response.data);
                setFilteredSuppliers(response.data);
                setFilteredBuyers(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchContractors();
    }, []);

    // Функція для отримання відфільтрованих даних з сервера
    const fetchFilteredContractors = async (searchText, type) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/invoices/contractors/search?query=${encodeURIComponent(searchText)}`);

            if (type === 'supplier') {
                setFilteredSuppliers(response.data);
            } else {
                setFilteredBuyers(response.data);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    
    // Посилання для обробки кліків поза випадаючими списками
    const supplierRef = useRef(null);
    const buyerRef = useRef(null);
    
    // Обробники введення тексту для пошуку контрагентів
    const handleSupplierSearchChange = (e) => {
        const value = e.target.value;
        setSupplierSearch(value);
        setShowSupplierDropdown(true);

        // Якщо рядок пошуку порожній, показуємо всіх контрагентів
        if (value.trim() === '') {
            setFilteredSuppliers(contractors);
        } else {
            // Інакше виконуємо пошук на сервері
            fetchFilteredContractors(value, 'supplier');
        }
    };
    
    const handleBuyerSearchChange = (e) => {
        const value = e.target.value;
        setBuyerSearch(value);
        setShowBuyerDropdown(true);

        // Якщо рядок пошуку порожній, показуємо всіх контрагентів
        if (value.trim() === '') {
            setFilteredBuyers(contractors);
        } else {
            // Інакше виконуємо пошук на сервері
            fetchFilteredContractors(value, 'buyer');
        }
    };
    
    // Обробники вибору контрагента зі списку
    const handleSelectSupplier = (contractor) => {
        setSupplierSearch(contractor.name);
        setFormData({
            ...formData,
            supplierId: contractor.id,
            supplierName: contractor.name
        });
        setShowSupplierDropdown(false);
    };
    
    const handleSelectBuyer = (contractor) => {
        setBuyerSearch(contractor.name);
        setFormData({
            ...formData,
            buyerId: contractor.id,
            buyerName: contractor.name
        });
        setShowBuyerDropdown(false);
    };
    
    // Поточний рахунок для операцій
    const [currentInvoice, setCurrentInvoice] = useState(null);
    
    // Форма для створення/редагування рахунку
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        invoiceDate: '',
        supplierName: '',
        buyerName: '',
        totalSum: '',
        items: []
    });
