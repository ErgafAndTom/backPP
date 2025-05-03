import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const InvoicePrint = ({ show, onHide, invoice, loading, onPrint }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Друк рахунку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Завантаження...</span>
                        </Spinner>
                        <p className="mt-2">Підготовка документа для друку...</p>
                    </div>
                ) : (
                    <>
                        {invoice ? (
                            <div>
                                <h5 className="mb-3">Підтвердіть друк рахунку:</h5>
                                <div className="mb-3">
                                    <strong>Номер рахунку:</strong> {invoice.invoiceNumber}
                                </div>
                                <div className="mb-3">
                                    <strong>Дата:</strong> {invoice.invoiceDate}
                                </div>
                                <div className="mb-3">
                                    <strong>Постачальник:</strong> {invoice.supplierName}
                                </div>
                                <div className="mb-3">
                                    <strong>Покупець:</strong> {invoice.buyerName}
                                </div>
                                <div className="mb-3">
                                    <strong>Сума:</strong> {invoice.totalSum} грн.
                                </div>
                            </div>
                        ) : (
                            <p>Немає даних для відображення</p>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Скасувати
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onPrint} 
                    disabled={loading || !invoice}
                >
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Генерація документу...</span>
                        </>
                    ) : (
                        'Друкувати рахунок'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoicePrint;
