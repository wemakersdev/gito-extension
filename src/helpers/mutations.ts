export const createAuthor = `
	mutation($author:[AddAuthorInput!]!){
		addAuthor(input:$author){
			author{
				id
			}
		}
	}
`;

export const updateAuthor = `
	mutation($author:UpdateAuthorInput!){
  updateAuthor(input:$author){
    blogPost{
      id
    }
  }
}
`;

export const createBlog = `
	mutation{
		addBlogPost(input: $blogPost, author:{id:$authorId}}]){
			blogPost{
				id
			}
		}
	}
`;

export const addBlog = `
	mutation($blogPost:AddBlogPostInput!){
	addBlogPost(input:$blogPost){
		blogPost{
		id
		}
	}
	}
`

export const updateBlog = `
mutation($blogPost:UpdateBlogPostInput!){
  updateBlogPost(input:$blogPost){
    blogPost{
      id
    }
  }
}
`