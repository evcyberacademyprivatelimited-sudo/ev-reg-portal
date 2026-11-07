import React, { useState } from 'react';
import {
  X,
  Video,
  Play,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { VideoItem, VideoPlacement } from '../../types';
import { extractYouTubeId, buildYouTubeEmbedUrl } from '../../lib/youtube';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { YouTubeEmbed } from '../common/YouTubeEmbed';

interface VideoEditorModalProps {
  video?: VideoItem | null;
  onClose: () => void;
}

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({ video, onClose }) => {
  const { courses, saveVideo } = useData();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    youtube_url: video?.youtube_url || '',
    placement: (video?.placement || 'hero') as VideoPlacement,
    pinned_homepage: video?.pinned_homepage ?? false,
    pinned_course_id: video?.pinned_course_id || '',
    is_active: video?.is_active ?? true,
    autoplay: video?.autoplay ?? true,
    muted_autoplay: video?.muted_autoplay ?? true,
    show_controls: video?.show_controls ?? true,
    sort_order: video?.sort_order ?? 0,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const parsedId = extractYouTubeId(formData.youtube_url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      notifyError('Video title is required.');
      return;
    }

    if (!parsedId) {
      notifyError('Please enter a valid YouTube URL or 11-character Video ID.');
      return;
    }

    setIsSaving(true);
    const res = await saveVideo({
      id: video?.id,
      title: formData.title,
      description: formData.description,
      youtube_url: formData.youtube_url,
      youtube_video_id: parsedId,
      placement: formData.placement,
      pinned_homepage: formData.pinned_homepage,
      pinned_course_id: formData.pinned_course_id || null,
      is_active: formData.is_active,
      autoplay: formData.autoplay,
      muted_autoplay: formData.muted_autoplay,
      show_controls: formData.show_controls,
      sort_order: Number(formData.sort_order),
    });
    setIsSaving(false);

    if (res.success) {
      success('Video saved successfully.');
      onClose();
    } else {
      notifyError('Failed to save video', res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {video ? 'Edit YouTube Stream' : 'Deploy New YouTube Stream'}
              </h2>
              <p className="text-xs text-slate-400">Admin-Controlled Video Management</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Preview / Mode Toggle */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Embed Preview
            </span>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Return to Config' : 'Preview Player'}</span>
            </button>
          </div>

          {previewMode ? (
            <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800">
              {parsedId ? (
                <YouTubeEmbed
                  urlOrId={parsedId}
                  title={formData.title || 'Preview Player'}
                  description={formData.description}
                  autoplay={formData.autoplay}
                  muted={formData.muted_autoplay}
                  showControls={formData.show_controls}
                />
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Provide a valid YouTube link or ID to see live preview.
                </div>
              )}
            </div>
          ) : (
            <form id="video-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* YouTube URL or ID */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  YouTube Video URL or 11-char ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=inWWhr5tnEA or inWWhr5tnEA"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
                {parsedId ? (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Parsed Video ID: <strong>{parsedId}</strong> (Privacy-Enhanced Nocookie Domain Ready)</span>
                  </p>
                ) : formData.youtube_url ? (
                  <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Could not extract 11-character YouTube video ID.</span>
                  </p>
                ) : null}
              </div>

              {/* Title & Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Video Headline / Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inside the EV Cyber War Room: Live Range Walkthrough"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what candidates will see in this video..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>

              {/* Placement & Pinned Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Placement
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) =>
                      setFormData({ ...formData, placement: e.target.value as VideoPlacement })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="hero">Hero (Front and Center)</option>
                    <option value="after_hero">After Hero / Range Tour</option>
                    <option value="course_details">Course Details Page</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pin to Specific Program (Optional)
                  </label>
                  <select
                    value={formData.pinned_course_id}
                    onChange={(e) => setFormData({ ...formData, pinned_course_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="">-- None (Global) --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Switches & Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold uppercase tracking-wider text-slate-500 block">
                  Autoplay &amp; Playback Policies
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Pin to homepage */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pinned_homepage}
                      onChange={(e) =>
                        setFormData({ ...formData, pinned_homepage: e.target.checked })
                      }
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-slate-800">Pin to Homepage Hero</span>
                  </label>

                  {/* Active / Publish */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-slate-800">Active / Published</span>
                  </label>

                  {/* Autoplay */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoplay}
                      onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-slate-800">Enable Autoplay</span>
                  </label>

                  {/* Muted Autoplay */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.muted_autoplay}
                      onChange={(e) =>
                        setFormData({ ...formData, muted_autoplay: e.target.checked })
                      }
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-slate-800">Muted Autoplay (Browser Policy)</span>
                  </label>

                  {/* Show controls */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_controls}
                      onChange={(e) =>
                        setFormData({ ...formData, show_controls: e.target.checked })
                      }
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-slate-800">Always Show Player Controls</span>
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="video-form"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {isSaving ? 'Deploying...' : video ? 'Update Stream' : 'Deploy YouTube Stream'}
          </button>
        </div>
      </div>
    </div>
  );
};

