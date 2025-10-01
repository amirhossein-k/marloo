'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import toast from 'react-hot-toast';
import styles from '@/features/styles/Tagss.module.css';

interface TagType {
  id: string;
  text: string;
  className?: string;
}
interface TagssProps {
  onTagsChange?: (tags: string[]) => void;
}

const SUGGESTIONS: TagType[] = [
  { id: 'ضد آب', text: 'ضد آب', className: '' },
  { id: 'سبک', text: 'سبک', className: '' },
  { id: 'مقاوم', text: 'مقاوم', className: '' },
];

const Tagss = ({ onTagsChange }: TagssProps) => {
  const [tags, setTags] = useState<TagType[]>([]);


  useEffect(() => {
    onTagsChange?.(tags.map((t) => t.text));
  }, [tags, onTagsChange]);

  const handleDelete = useCallback((index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }, []);

  const handleAddition = useCallback((tag: Tag) => {
    if (!tag.text.trim()) {
      toast.error('تگ نمی‌تواند خالی باشد');
      return;
    }
    if (tags.some((t) => t.text === tag.text)) {
      toast.error('این تگ قبلاً اضافه شده است');
      return;
    }
    if (tags.length >= 8) {
      toast.error('حداکثر 8 تگ مجاز است');
      return;
    }
    const newTag: TagType = { id: tag.text, text: tag.text, className: '' };
    setTags((prevTags) => [...prevTags, newTag]);
  }, [tags]);

  const handleDrag = useCallback((tag: Tag, currPos: number, newPos: number) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      const draggedTag: TagType = { id: tag.id, text: tag.id, className: '' };
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, draggedTag);
      return newTags;
    });
  }, []);

  const handleTagClick = useCallback((index: number) => {
    console.log(`The tag at index ${index} was clicked`);
  }, []);

  const onTagUpdate = useCallback((index: number, newTag: Tag) => {
    if (!newTag.text.trim()) {
      toast.error('تگ نمی‌تواند خالی باشد');
      return;
    }
    setTags((prevTags) => {
      const updatedTags = [...prevTags];
      updatedTags.splice(index, 1, { id: newTag.text, text: newTag.text, className: '' });
      return updatedTags;
    });
  }, []);

  const onClearAll = useCallback(() => {
    setTags([]);
    toast.success('همه تگ‌ها پاک شدند');
  }, []);

  return (
    <div className={styles.app}>
      <h1>ویژگی‌های محصول</h1>
      <div>
        <ReactTags
          tags={tags.map(tag => ({ ...tag, className: tag.className || '' }))}
          inputFieldPosition="top"
          suggestions={SUGGESTIONS.map(suggestion => ({ ...suggestion, className: suggestion.className || '' }))}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          onTagUpdate={onTagUpdate}
          editable
          clearAll
          onClearAll={onClearAll}
          maxTags={8}
          allowAdditionFromPaste
          classNames={{
            tags: styles.ReactTags__tags,
            tagInput: styles.ReactTags__tagInput,
            tagInputField: styles.ReactTags__tagInputField,
            selected: styles.ReactTags__selected,
            tag: styles.ReactTags__tag,
            remove: styles.ReactTags__remove,
            suggestions: styles.ReactTags__suggestions,
            activeSuggestion: styles.ReactTags__activeSuggestion,
            clearAll: styles.ReactTags__clearAll,
          }}
        />
      </div>
    </div>
  );

};export default memo(Tagss);