import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, Calendar, MessageSquare, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type TabType = 'properties' | 'agents' | 'appointments' | 'inquiries';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">لوحة التحكم الإدارية</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <TabButton
            active={activeTab === 'properties'}
            onClick={() => setActiveTab('properties')}
            icon={<Home className="h-5 w-5" />}
            label="العقارات"
          />
          <TabButton
            active={activeTab === 'agents'}
            onClick={() => setActiveTab('agents')}
            icon={<Users className="h-5 w-5" />}
            label="الوكلاء"
          />
          <TabButton
            active={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
            icon={<Calendar className="h-5 w-5" />}
            label="المواعيد"
          />
          <TabButton
            active={activeTab === 'inquiries'}
            onClick={() => setActiveTab('inquiries')}
            icon={<MessageSquare className="h-5 w-5" />}
            label="الاستفسارات"
          />
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl">
          {activeTab === 'properties' && <PropertiesPanel />}
          {activeTab === 'agents' && <AgentsPanel />}
          {activeTab === 'appointments' && <AppointmentsPanel />}
          {activeTab === 'inquiries' && <InquiriesPanel />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PropertiesPanel() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, agents(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        alert('خطأ في تحميل العقارات: ' + error.message);
      } else if (data) {
        console.log('Properties loaded:', data);
        setProperties(data);
      }
    } catch (err) {
      console.error('Exception fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchProperties();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">إدارة العقارات</h2>
        <button
          onClick={() => navigate('/admin/properties/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة عقار جديد
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-slate-300 font-medium">العنوان</th>
              <th className="px-4 py-3 text-slate-300 font-medium">النوع</th>
              <th className="px-4 py-3 text-slate-300 font-medium">السعر</th>
              <th className="px-4 py-3 text-slate-300 font-medium">المدينة</th>
              <th className="px-4 py-3 text-slate-300 font-medium">الوكيل</th>
              <th className="px-4 py-3 text-slate-300 font-medium">الحالة</th>
              <th className="px-4 py-3 text-slate-300 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-3 text-white">{property.title}</td>
                <td className="px-4 py-3 text-slate-300">{property.type === 'sale' ? 'للبيع' : 'للإيجار'}</td>
                <td className="px-4 py-3 text-slate-300">
                  {property.price ? new Intl.NumberFormat('fr-DZ', {
                    style: 'currency',
                    currency: 'DZD',
                    minimumFractionDigits: 0,
                  }).format(typeof property.price === 'string' ? parseFloat(property.price) : property.price) : '-'}
                </td>
                <td className="px-4 py-3 text-slate-300">{property.city}</td>
                <td className="px-4 py-3 text-slate-300">{property.agents?.name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    property.status === 'available' ? 'bg-green-900 text-green-200' :
                    property.status === 'sold' ? 'bg-red-900 text-red-200' :
                    'bg-yellow-900 text-yellow-200'
                  }`}>
                    {property.status === 'available' ? 'متاح' : property.status === 'sold' ? 'مباع' : 'مؤجر'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="p-2 text-blue-400 hover:bg-blue-900/50 rounded transition-colors"
                      title="عرض"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                      className="p-2 text-green-400 hover:bg-green-900/50 rounded transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="p-2 text-red-400 hover:bg-red-900/50 rounded transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <p className="text-center py-8 text-slate-400">لا توجد عقارات</p>
        )}
      </div>
    </div>
  );
}

function AgentsPanel() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agents:', error);
      } else if (data) {
        setAgents(data);
      }
    } catch (err) {
      console.error('Exception fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">إدارة الوكلاء</h2>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{agent.name}</h3>
              <p className="text-slate-400 text-sm">{agent.email}</p>
              <p className="text-slate-400 text-sm">{agent.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, properties(title), agents(name)')
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else if (data) {
        setAppointments(data);
      }
    } catch (err) {
      console.error('Exception fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      fetchAppointments();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-6">إدارة المواعيد</h2>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">العقار</p>
                <p className="text-white font-medium">{appointment.properties?.title}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">العميل</p>
                <p className="text-white">{appointment.client_name}</p>
                <p className="text-slate-400 text-sm">{appointment.client_phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">التاريخ والوقت</p>
                <p className="text-white">{appointment.appointment_date} - {appointment.appointment_time}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">الحالة</p>
                <select
                  value={appointment.status}
                  onChange={(e) => updateStatus(appointment.id, e.target.value)}
                  className="mt-1 block w-full rounded-md bg-slate-600 border-slate-500 text-white"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="cancelled">ملغي</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
      } else if (data) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Exception fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-6">الاستفسارات</h2>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm">الاسم</p>
                <p className="text-white">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">البريد الإلكتروني</p>
                <p className="text-white">{inquiry.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">رقم الهاتف</p>
                <p className="text-white">{inquiry.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">العقار</p>
                <p className="text-white">{inquiry.properties?.title || 'استفسار عام'}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">الرسالة</p>
              <p className="text-white bg-slate-600 p-3 rounded">{inquiry.message}</p>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              {new Date(inquiry.created_at).toLocaleString('ar-DZ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
