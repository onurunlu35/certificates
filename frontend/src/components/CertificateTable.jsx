import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { FileIcon, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import CertificateForm from './CertificateForm';

const API_URL = 'http://localhost:5001/api';

const CertificateTable = () => {
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching certificates...');
      const response = await axios.get(`${API_URL}/certificates/public`);
      console.log('Received certificates:', response.data);
      setCertificates(response.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(err.message);
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setIsDialogOpen(true);
  };

  const handleFormClose = () => {
    setEditingCertificate(null);
    setIsDialogOpen(false);
    fetchCertificates();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ship Certificates</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>At</TableHead>
              <TableHead>On</TableHead>
              <TableHead>Last Annual</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-center">Certificate No</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No certificates found
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.type}</TableCell>
                  <TableCell className="relative">
                    {cert.issuer}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.issuer_tag}
                    </span>
                  </TableCell>
                  <TableCell className="relative">
                    {cert.at_location}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.at_location_tag}
                    </span>
                  </TableCell>
                  <TableCell className="relative">
                    {cert.on_date ? new Date(cert.on_date).toLocaleDateString('en-GB') : '-'}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.on_date_tag}
                    </span>
                  </TableCell>
                  <TableCell className="relative">
                    {cert.last_annual ? new Date(cert.last_annual).toLocaleDateString('en-GB') : '-'}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.last_annual_tag}
                    </span>
                  </TableCell>
                  <TableCell className="relative">
                    {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString('en-GB') : '-'}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.expiry_tag}
                    </span>
                  </TableCell>
                  <TableCell className="relative text-center">
                    {cert.certificate_no || '-'}
                    <span className="absolute bottom-1 right-1 text-xs text-orange-500">
                      {cert.certificate_no_tag}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileIcon className="h-4 w-4 text-blue-500" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost"
                        onClick={() => handleEdit(cert)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Edit Certificate Details
              </DialogTitle>
            </DialogHeader>
            <CertificateForm 
              onSubmitSuccess={handleFormClose}
              editData={editingCertificate}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CertificateTable;