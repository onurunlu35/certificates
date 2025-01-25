import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const API_URL = 'http://localhost:5001/api';

const TagExtractor = () => {
  const [tag, setTag] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    if (!tag.trim()) {
      setError('Please enter a tag');
      setResult(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/certificates/public`);
      const certificates = response.data;

      // Tüm sertifikaları tara ve etiket değerini bul
      let found = false;
      for (const cert of certificates) {
        // Tüm tag alanlarını kontrol et
        if (cert.issuer_tag === tag) {
          setResult({ value: cert.issuer, type: cert.type });
          found = true;
          break;
        }
        if (cert.at_location_tag === tag) {
          setResult({ value: cert.at_location, type: cert.type });
          found = true;
          break;
        }
        if (cert.on_date_tag === tag) {
          setResult({ value: cert.on_date ? new Date(cert.on_date).toLocaleDateString('en-GB') : '-', type: cert.type });
          found = true;
          break;
        }
        if (cert.last_annual_tag === tag) {
          setResult({ value: cert.last_annual ? new Date(cert.last_annual).toLocaleDateString('en-GB') : '-', type: cert.type });
          found = true;
          break;
        }
        if (cert.expiry_tag === tag) {
          setResult({ value: cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString('en-GB') : '-', type: cert.type });
          found = true;
          break;
        }
        if (cert.certificate_no_tag === tag) {
          setResult({ value: cert.certificate_no || '-', type: cert.type });
          found = true;
          break;
        }
      }

      if (!found) {
        setError('Tag not found');
        setResult(null);
      } else {
        setError(null);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
      setResult(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleExtract();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tag Extractor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Input Area */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tag (e.g., c11, c23)"
                  className="w-full"
                />
              </div>
              <Button onClick={handleExtract}>
                Extract
              </Button>
            </div>

            {/* Result Area */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-green-50 rounded">
                <div className="font-medium">Found in: {result.type}</div>
                <div className="mt-2">Value: {result.value}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagExtractor;