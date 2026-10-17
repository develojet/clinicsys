import React, {useState, useRef} from 'react';
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {X, Check} from 'lucide-react';
import {getCroppedImg} from '../utils/cropUtils';

export const ImageCropModal = ({imageSrc, aspect, onCropComplete, onClose, title = 'Crop Image'}) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    const onImageLoad = (e) => {
        const {width, height} = e.currentTarget;
        if (aspect) {
            const initialCrop = centerCrop(
                makeAspectCrop({unit: '%', width: 90}, aspect, width, height),
                width,
                height
            );
            setCrop(initialCrop);
        }
    };

    const handleSave = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
            onCropComplete(croppedFile);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-4 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                        <X size={18}/>
                    </button>
                </div>

                <div
                    className="max-h-[60vh] overflow-auto flex items-center justify-center bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full mb-6">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop source"
                            onLoad={onImageLoad}
                            className="max-h-[50vh] object-contain rounded-lg"
                        />
                    </ReactCrop>
                </div>

                <div className="flex justify-end gap-3 w-full pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-md hover:bg-blue-700 flex items-center gap-2 transition-all"
                    >
                        <Check size={14}/> Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};