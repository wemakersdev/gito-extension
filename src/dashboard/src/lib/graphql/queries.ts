export const getAllBlogPosts = `
	query{
		queryBlogPost{
			id, 
			content,
			title,
			author{
				name,
				id,
			}
		}
	}
`;

export const getAllBlogPostsByAuthor = `
query($authorFilter: AuthorFilter){
  queryAuthor(filter:$authorFilter){
    name,
    blogs{
      id,
      title,
      content
    }
  }
}
`

export const getBlogPost = `
query($blogPostFilter: BlogPostFilter){
  queryBlogPost(filter:$blogPostFilter){
	  id,
    content,
	title,
	author{
		name,
		id
	}
  }
}
`
