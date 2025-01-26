import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CertificateTable from '../components/CertificateTable';
import { Button } from "../components/ui/button";
import TagExtractor from '../components/TagExtractor';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('certificates');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-semibold">Ship Certificates</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleSignOut}
                variant="outline"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6">
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

        {activeTab === 'certificates' ? (
          <CertificateTable />
        ) : (
          <TagExtractor />
        )}
      </div>
    </div>
  );
};

export default Dashboard;