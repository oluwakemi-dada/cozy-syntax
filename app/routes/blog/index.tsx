import { useSearchParams } from 'react-router';
import type { Route } from './+types/index';
import type { PostMeta } from '~/types';
import PostCard from '~/components/PostCard';
import Pagination from '~/components/Pagination';
import PostFilter from '~/components/PostFilter';
import { useState } from 'react';

export const loader = async ({
  request,
}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> => {
  const url = new URL('/posts-meta.json', request.url);
  const res = await fetch(url.href);

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  return { posts: data };
};

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const postsPerPage = 10;

  const { posts } = loaderData;

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();

    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  const updatePage = (newPage: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage);
      return params;
    });
  };

  const updateSearch = (newSearch: string) => {
    setSearchQuery(newSearch);

    // reset to first page when search changes
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', '1');
      return params;
    });
  };

  return (
    <div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
      <h2 className='text-3xl text-white font-bold mb-8'>📝 Blog</h2>
      <PostFilter
        searchQuery={searchQuery}
        onSearchChange={(query) => updateSearch(query)}
      />

      <div className='space-7-8'>
        {currentPosts.length === 0 ? (
          <p className='p.text-gray-400 text-center'>No posts found</p>
        ) : (
          currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={updatePage}
        />
      )}
    </div>
  );
};

export default BlogPage;
