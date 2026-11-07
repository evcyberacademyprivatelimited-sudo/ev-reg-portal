import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { VideoEditorModal } from '../../components/admin/VideoEditorModal';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { VideoItem } from '../../types';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Play,
  VolumeX,
  Volume2,
  CheckCircle2,
  Pin,
  ExternalLink,
  Eye,
} from 'lucide-react';

export const AdminVideosPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { videos, courses, saveVideo, deleteVideo } = useData();
  const { success, error: notifyError } = useNotification();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  const handleCreate = () => {
    setEditingVideo(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setIsEditorOpen(true);
  };

  const handleToggleActive = async (video: VideoItem) => {
    const nextState = !video.is_active;
    const res = await saveVideo({ id: video.id, is_active: nextState });
    if (res.success) {
      success(`Video ${nextState ? 'enabled' : 'disabled'}.`);
    } else {
      notifyError('Failed to update video status', res.error);
    }
  };

  const handleTogglePinHomepage = async (video: VideoItem) => {
    const nextState = !video.pinned_homepage;
    const res = await saveVideo({ id: video.id, pinned_homepage: nextState });
    if (res.success) {
      success(nextState ? 'Video pinned to homepage hero.' : 'Video unpinned from homepage.');
    } else {
      notifyError('Failed to update pin state', res.error);
    }
  };

  const handleDelete = async (video: VideoItem) => {
    if (!confirm(`Are you sure you want to remove video: "${video.title}"?`)) {
      return;
    }
    const res = await deleteVideo(video.id);
    if (res.success) {
      success('Video deleted.');
    } else {
      notifyError('Delete failed', res.error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Admin-Controlled YouTube Video Management"
        subtitle="Manage hero walkthroughs, course trailers, and privacy-enhanced video embeds with sound and autoplay controls."
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add YouTube Video</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {/* Guidelines alert */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 space-y-0.5">
            <p className="font-bold text-slate-900">Privacy-Enhanced &amp; Browser-Compliant Streaming</p>
            <p>
              All embeds automatically utilize the privacy-friendly <code className="font-mono text-red-600">youtube-nocookie.com</code> domain. Muted autoplay is enforced by default to respect modern Chromium &amp; Safari autoplay restrictions, and explicit unmute controls are provided to visitors.
            </p>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videos.map((video) => {
            const course = courses.find((c) => c.id === video.pinned_course_id);

            return (
              <div
                key={video.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Video Header & Embed Component */}
                <div>
                  <div className="p-4 bg-slate-950 text-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {video.pinned_homepage && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          <span>Pinned to Homepage Hero</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        Placement: {video.placement}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(video)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        video.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {video.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  {/* YouTube Embed Player */}
                  <div className="p-4">
                    <YouTubeEmbed
                      urlOrId={video.youtube_video_id || video.youtube_url}
                      title={video.title}
                      description={video.description}
                      autoplay={false}
                      muted={video.muted_autoplay}
                      showControls={video.show_controls}
                    />
                  </div>

                  {/* Meta Details */}
                  <div className="px-6 pb-4 space-y-2 text-xs">
                    <h3 className="font-bold text-slate-900 text-sm">{video.title}</h3>
                    {video.description && (
                      <p className="text-slate-500 line-clamp-2 leading-relaxed">{video.description}</p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        ID: {video.youtube_video_id}
                      </span>
                      {course && (
                        <span className="bg-red-50 text-red-700 font-medium px-2 py-0.5 rounded">
                          Linked to: {course.title}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Autoplay: {video.autoplay ? 'Yes (Muted)' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePinHomepage(video)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
                        video.pinned_homepage
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{video.pinned_homepage ? 'Unpin Homepage' : 'Pin to Homepage'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(video)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(video)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <VideoEditorModal
          video={editingVideo}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingVideo(null);
          }}
        />
      )}
    </div>
  );
};
