# Book Management UI - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login Page](#login-page)
3. [Books Management](#books-management)
4. [Add Book](#add-book)
5. [Authors & Genres Management](#authors--genres-management)
6. [Documents Management](#documents-management)
7. [RAG Search](#rag-search)
8. [Document Summary](#document-summary)
9. [Ingestion Management](#ingestion-management)
10. [Admin Users](#admin-users)
11. [Role-Based Access Control](#role-based-access-control)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- Valid user credentials

### Accessing the Application
1. Open your web browser
2. Navigate to the application URL (typically `http://localhost:3000`)
3. You will be redirected to the login page

---

## Login Page

**URL:** `/login`

**Purpose:** Authenticate users to access the application

### How to Use:
1. Enter your username in the "Username" field
2. Enter your password in the "Password" field
3. Click the "Login" button
4. Upon successful authentication, you'll be redirected to the Books page

### When to Use:
- First time accessing the application
- After logging out
- When your session expires

### Features:
- Form validation for required fields
- Error messages for invalid credentials
- Automatic redirection after successful login

**Note:** *Screenshot placeholder - Login form with username/password fields and login button*

---

## Books Management

**URL:** `/books`

**Purpose:** View, edit, and delete books in the system

### How to Use:

#### Viewing Books:
- The page displays all books in a sortable data table
- Columns include: Title, Author, Genre, Year Published, Actions
- Use pagination controls at the bottom to navigate through multiple pages
- Click column headers to sort data

#### Editing a Book:
1. Click the "Edit" button for the desired book
2. An edit form will appear above the table
3. Modify the fields as needed:
   - Title (required)
   - Author (dropdown selection)
   - Genre (dropdown selection)
   - Year Published
   - Summary (optional)
4. Click "Update Book" to save changes
5. Click "Cancel" to discard changes

#### Deleting a Book:
1. Click the "Delete" button for the desired book
2. Confirm deletion in the popup dialog
3. The book will be removed from the list

### When to Use:
- To view all books in the system
- To update book information
- To remove outdated or incorrect book entries
- To check book details before making changes

### Features:
- Sortable columns
- Pagination for large datasets
- Inline editing with dropdown selections
- Role-based button controls
- Real-time author/genre name display

**Note:** *Screenshot placeholder - Books table with edit form and action buttons*

---

## Add Book

**URL:** `/add-book`

**Purpose:** Add new books to the system

### How to Use:

#### Adding a Book with Existing Author/Genre:
1. Fill in the "Title" field (required)
2. Select an author from the "Author" dropdown (required)
3. Select a genre from the "Genre" dropdown (optional)
4. Enter the "Year Published" (optional)
5. Click "Save Book"

#### Adding a Book with New Author/Genre:
1. Fill in the "Title" field (required)
2. For Author:
   - Select "+ Add New Author" from the dropdown
   - Enter the new author name in the text field that appears
3. For Genre:
   - Select "+ Add New Genre" from the dropdown
   - Enter the new genre name in the text field that appears
4. Enter the "Year Published" (optional)
5. Click "Save Book"

### When to Use:
- Adding new books to the library
- When you need to create new authors or genres
- Bulk data entry of book collections

### Features:
- Dynamic form fields for new authors/genres
- Form validation
- Automatic creation of new authors/genres
- Dropdown population from database
- Success/error feedback

**Note:** *Screenshot placeholder - Add book form with dropdown selections and new author/genre input fields*

---

## Authors & Genres Management

**URL:** `/author-genre`

**Purpose:** Manage authors and genres with full CRUD operations

### How to Use:

#### Switching Between Authors and Genres:
- Click the "Authors" tab to manage authors
- Click the "Genres" tab to manage genres

#### Adding New Items:
1. Click "Add Author" or "Add Genre" button
2. Enter the name in the form that appears
3. Click "Create" to save
4. Click "Cancel" to discard

#### Editing Items:
1. Click the "Edit" button for the desired item
2. Modify the name in the form
3. Click "Update" to save changes
4. Click "Cancel" to discard changes

#### Deleting Items:
1. Click the "Delete" button for the desired item
2. Confirm deletion in the popup dialog
3. The item will be removed from the list

### When to Use:
- Managing the master list of authors
- Organizing genre categories
- Cleaning up duplicate or incorrect entries
- Preparing data before adding books

### Features:
- Tabbed interface for easy switching
- Sortable data tables
- Inline add/edit forms
- Bulk operations support
- Role-based access controls

**Note:** *Screenshot placeholder - Tabbed interface showing authors/genres tables with CRUD operations*

---

## Documents Management

**URL:** `/documents`

**Purpose:** Upload, manage, and organize documents

### How to Use:

#### Uploading Documents:
1. Click "Choose File" button
2. Select a document from your computer
3. Click "Upload Document"
4. Wait for the upload confirmation

#### Managing Documents:
- View all uploaded documents in the table
- See document details: Name, Size, Upload Date
- Use action buttons for each document:
  - **Download:** Save document to your computer
  - **Summary:** Generate AI summary (redirects to Summary page)
  - **Delete:** Remove document from system

#### Document Actions:
- **Download:** Click to download the original file
- **Delete:** Remove document after confirmation
- **Summary:** Generate AI-powered document summary

### When to Use:
- Uploading reference materials
- Managing document libraries
- Preparing documents for RAG search
- Organizing research materials

### Features:
- File upload with progress indication
- Document metadata display
- Bulk operations
- Integration with summary generation
- File type validation

**Note:** *Screenshot placeholder - Document upload interface and document list table*

---

## RAG Search

**URL:** `/rag`

**Purpose:** Search through documents using AI-powered retrieval

### How to Use:

#### Performing a Search:
1. Enter your search query in the search box
2. Click "Search" button
3. Review the search results displayed below
4. Results show relevant document excerpts and sources

#### Understanding Results:
- Results are ranked by relevance
- Each result shows:
  - Document excerpt
  - Source document name
  - Relevance score
  - Context information

### When to Use:
- Finding specific information across multiple documents
- Research and knowledge discovery
- Content analysis and insights
- Question-answering from document collections

### Features:
- Natural language search queries
- AI-powered relevance ranking
- Source attribution
- Context highlighting
- Real-time search results

**Note:** *Screenshot placeholder - Search interface with query box and results display*

---

## Document Summary

**URL:** `/summary`

**Purpose:** Generate AI-powered summaries of uploaded documents

### How to Use:

#### Generating a Summary:
1. Select a document from the dropdown menu
2. Click "Generate Summary" button
3. Wait for the AI processing to complete
4. Review the generated summary

#### Using Summaries:
- Read the key points extracted from the document
- Use summaries for quick document review
- Share summaries with team members
- Use as reference for further analysis

### When to Use:
- Quick document review
- Creating executive summaries
- Content analysis and extraction
- Preparing document overviews

### Features:
- AI-powered content extraction
- Key point identification
- Structured summary format
- Document selection dropdown
- Processing status indicators

**Note:** *Screenshot placeholder - Document selection dropdown and generated summary display*

---

## Ingestion Management

**URL:** `/ingestion`

**Purpose:** Process and ingest documents for search functionality

### How to Use:

#### Processing Documents:
1. View the list of uploaded documents
2. Check the ingestion status for each document
3. Click "Start Ingestion" for unprocessed documents
4. Monitor the processing status
5. View today's processing statistics

#### Monitoring Progress:
- Check ingestion status indicators
- View processing statistics
- Track completion rates
- Monitor system performance

### When to Use:
- Preparing documents for RAG search
- Batch processing of document collections
- System maintenance and optimization
- Performance monitoring

### Features:
- Real-time status tracking
- Batch processing capabilities
- Progress indicators
- Statistics dashboard
- Error handling and reporting

**Note:** *Screenshot placeholder - Ingestion dashboard with document status and processing controls*

---

## Admin Users

**URL:** `/admin/users`

**Purpose:** Manage users and roles in the system

### How to Use:

#### Managing Users:
1. Click the "Users" tab
2. View all system users in the table
3. Use action buttons to:
   - **Edit:** Modify user information and roles
   - **Delete:** Remove users from the system
4. Click "Add User" to create new accounts

#### Managing Roles:
1. Click the "Roles" tab
2. View all available roles
3. See role permissions and settings
4. Manage role assignments

#### User Operations:
- **Add User:** Create new user accounts
- **Edit User:** Update user information and role assignments
- **Delete User:** Remove user access
- **Role Assignment:** Assign appropriate roles to users

### When to Use:
- Setting up new user accounts
- Managing user permissions
- Updating user information
- System administration tasks

### Features:
- Tabbed interface for users and roles
- Role-based permission management
- User information editing
- Bulk user operations
- Security controls

**Note:** *Screenshot placeholder - Admin interface with user management tables and role assignments*

---

## Role-Based Access Control

### Permission Levels:

#### Admin Users (`is_admin: true`):
- Full access to all features
- Can edit and delete all content
- Access to admin functions
- User management capabilities

#### Users with Write Permission:
- Can create, edit, and delete content
- Limited admin access
- Full CRUD operations on books, authors, genres

#### Read-Only Users:
- Can view all content
- Cannot edit or delete items
- Buttons are disabled for restricted actions
- Can perform searches and view summaries

### Visual Indicators:
- Disabled buttons appear grayed out
- Tooltips explain permission requirements
- Error messages for unauthorized actions
- Clear role indicators in user interface

### When Permissions Apply:
- **Books Management:** Edit/Delete buttons
- **Authors & Genres:** All CRUD operations
- **Document Management:** Upload/Delete operations
- **Admin Functions:** User management access

**Note:** *Screenshot placeholder - Interface showing disabled buttons for users without permissions*

---

## Navigation and General Usage

### Navigation Bar:
- **Book Manager:** Home link (returns to Books page)
- **Books:** View and manage books
- **Add Book:** Create new book entries
- **Authors & Genres:** Manage authors and genres
- **Documents:** Document management
- **Ingestion:** Process documents
- **RAG Search:** AI-powered search
- **Summary:** Generate document summaries
- **Admin:** User and role management
- **Logout:** End session and return to login

### Common Features Across Pages:
- Responsive design for mobile and desktop
- Data tables with sorting and pagination
- Form validation and error handling
- Success/error notifications
- Consistent styling and layout
- Role-based access controls

### Tips for Best Experience:
1. Use Chrome or Firefox for optimal performance
2. Ensure stable internet connection for API calls
3. Log out properly when finished
4. Contact administrator for permission issues
5. Use search and filter features for large datasets

---

## Troubleshooting

### Common Issues:

#### Login Problems:
- Verify username and password
- Check internet connection
- Contact administrator for account issues

#### Permission Errors:
- Check your user role and permissions
- Contact administrator to update permissions
- Ensure you're logged in with correct account

#### Upload Issues:
- Check file size and format
- Verify internet connection
- Try refreshing the page

#### Search Not Working:
- Ensure documents are properly ingested
- Check search query format
- Verify backend services are running

### Getting Help:
- Contact your system administrator
- Check application logs for error details
- Refer to this user guide for feature explanations
- Report bugs to the development team

---

*This user guide covers all major features and functionality of the Book Management UI. For technical support or additional questions, please contact your system administrator.*