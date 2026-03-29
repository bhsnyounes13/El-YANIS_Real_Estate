import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [agents, setAgents] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [existingVideoUrls, setExistingVideoUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'sale',
    price: '',
    city: '',
    area_m2: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    amenities: '',
    status: 'available',
    agent_id: ''
  });

  useEffect(() => {
    fetchAgents();
    if (isEditMode) {
      fetchProperty();
    }
  }, [id]);

  const fetchAgents = async () => {
    const { data } = await supabase
      .from('agents')
      .select('id, name')
      .order('name');

    if (data) {
      setAgents(data);
    }
  };

  const fetchProperty = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setFormData({
        title: data.title,
        type: data.type,
        price: data.price.toString(),
        city: data.city,
        area_m2: data.area_m2.toString(),
        bedrooms: data.bedrooms.toString(),
        bathrooms: data.bathrooms.toString(),
        description: data.description || '',
        amenities: (data.amenities || []).join(', '),
        status: data.status,
        agent_id: data.agent_id || ''
      });
      setExistingImageUrls(data.images || []);
      setExistingVideoUrls(data.videos || []);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 500 * 1024 * 1024;
    const validFiles: File[] = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`الفيديو ${file.name} كبير جداً (${(file.size / 1024 / 1024).toFixed(2)} ميغابايت). الحد الأقصى هو 500 ميغابايت.`);
        return;
      }
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrls(prev => [...prev, url]);
    });

    if (validFiles.length > 0) {
      setVideoFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviewUrls[index]);
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index: number) => {
    setExistingVideoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    const total = imageFiles.length;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress({current: i + 1, total});

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert(`فشل رفع الصورة: ${uploadError.message}`);
        continue;
      }

      if (uploadData) {
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(uploadData.path);

        console.log('Image uploaded successfully:', data.publicUrl);
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const uploadVideos = async () => {
    const uploadedUrls: string[] = [];
    const maxSize = 500 * 1024 * 1024;
    const total = videoFiles.length;

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      setUploadProgress({current: i + 1, total});

      if (file.size > maxSize) {
        alert(`الفيديو ${file.name} كبير جداً (${(file.size / 1024 / 1024).toFixed(2)} ميغابايت). الحد الأقصى هو 500 ميغابايت.`);
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      try {
        console.log(`Uploading video ${i+1}/${total}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading video:', uploadError);
          alert(`فشل رفع الفيديو ${file.name}: ${uploadError.message}`);
          continue;
        }

        if (uploadData) {
          const { data } = supabase.storage
            .from('property-images')
            .getPublicUrl(uploadData.path);

          console.log('Video uploaded successfully:', data.publicUrl);
          uploadedUrls.push(data.publicUrl);
        }
      } catch (err) {
        console.error('Exception uploading video:', err);
        alert(`خطأ في رفع الفيديو ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      console.log('Starting upload process...');
      console.log('Image files to upload:', imageFiles.length);
      console.log('Video files to upload:', videoFiles.length);

      const uploadedImageUrls = await uploadImages();
      console.log('Uploaded image URLs:', uploadedImageUrls);

      const uploadedVideoUrls = await uploadVideos();
      console.log('Uploaded video URLs:', uploadedVideoUrls);

      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];
      const allVideoUrls = [...existingVideoUrls, ...uploadedVideoUrls];
      console.log('All image URLs:', allImageUrls);
      console.log('All video URLs:', allVideoUrls);

      if (imageFiles.length > 0 && uploadedImageUrls.length === 0) {
        alert('فشل رفع الصور. يرجى المحاولة مرة أخرى.');
        return;
      }

      if (videoFiles.length > 0 && uploadedVideoUrls.length === 0) {
        alert('فشل رفع الفيديوهات. يرجى المحاولة مرة أخرى.');
        return;
      }

      const propertyData = {
        title: formData.title,
        type: formData.type,
        price: formData.price ? parseFloat(formData.price) : null,
        city: formData.city,
        area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        description: formData.description,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: allImageUrls,
        videos: allVideoUrls,
        status: formData.status,
        agent_id: formData.agent_id || null
      };

      console.log('Property data to save:', propertyData);

      let error;
      if (isEditMode) {
        ({ error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('properties')
          .insert([propertyData]));
      }

      if (!error) {
        alert('تم حفظ العقار بنجاح!');
        navigate('/admin/dashboard');
      } else {
        console.error('Database error:', error);
        alert(`حدث خطأ أثناء حفظ العقار: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      alert(`حدث خطأ أثناء حفظ العقار: ${error}`);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? 'تعديل العقار' : 'إضافة عقار جديد'}
            </h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  العنوان <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  النوع <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sale">للبيع</option>
                  <option value="rent">للإيجار</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  السعر (دينار جزائري) <span className="text-slate-500 text-xs">(اختياري)</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="اترك فارغاً إذا كان السعر عند الطلب"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  المدينة <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  المساحة (م²) <span className="text-slate-500 text-xs">(اختياري)</span>
                </label>
                <input
                  type="number"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  عدد غرف النوم <span className="text-slate-500 text-xs">(اختياري)</span>
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  عدد الحمامات <span className="text-slate-500 text-xs">(اختياري)</span>
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الحالة <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">متاح</option>
                  <option value="sold">مباع</option>
                  <option value="rented">مؤجر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الوكيل
                </label>
                <select
                  value={formData.agent_id}
                  onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">بدون وكيل</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الوصف
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                المميزات (مفصولة بفواصل)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="مثال: مسبح, موقف سيارات, حديقة"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                صور العقار
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">اضغط لاختيار الصور</span> أو اسحب وأفلت
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG, JPEG (الحد الأقصى 5MB)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {existingImageUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">الصور الحالية:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagePreviewUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">صور جديدة للرفع:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`معاينة ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                فيديوهات العقار
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">اضغط لرفع الفيديوهات</span>
                      </p>
                      <p className="text-xs text-slate-500">MP4, MOV, AVI (حتى 500 ميغابايت)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      multiple
                      onChange={handleVideoSelect}
                    />
                  </label>
                </div>

                {existingVideoUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">الفيديوهات الحالية:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingVideoUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={url}
                            className="w-full h-32 object-cover rounded-lg bg-slate-900"
                            controls={false}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingVideo(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videoPreviewUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">فيديوهات جديدة للرفع:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {videoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={url}
                            className="w-full h-32 object-cover rounded-lg bg-slate-900"
                            controls={false}
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {uploading && uploadProgress.total > 0 && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">
                    جاري الرفع... ({uploadProgress.current} من {uploadProgress.total})
                  </span>
                  <span className="text-sm text-slate-400">
                    {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {uploading ? 'جاري رفع الملفات...' : loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
