import React, { useState } from 'react';
import CertificateTable from './components/CertificateTable';
import TagExtractor from './components/TagExtractor';
import { Button } from "./components/ui/button";

function App() {
  const [activeTab, setActiveTab] = useState('certificates');

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'certificates' ? 'default' : 'outline'}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </Button>
        <Button 
          variant={activeTab === 'extractor' ? 'default' : 'outline'}
          onClick={() => setActiveTab('extractor')}
        >
          Tag Extractor
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'certificates' ? (
        <CertificateTable />
      ) : (
        <TagExtractor />
      )}
    </div>
  );
}

export default App;