
from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from apps.core.models import TimeStampedModel
from taggit.managers import TaggableManager
from django.urls import reverse

class ResearchCategory(TimeStampedModel):
    """Categories for research and publications"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff')
    icon = models.CharField(max_length=50, default='science')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Research Category"
        verbose_name_plural = "Research Categories"

    def __str__(self):
        return self.name

class Publication(TimeStampedModel):
    """Research publications and papers"""
    PUBLICATION_TYPES = [
        ('research_paper', 'Research Paper'),
        ('white_paper', 'White Paper'),
        ('report', 'Report'),
        ('case_study', 'Case Study'),
        ('policy_brief', 'Policy Brief'),
        ('working_paper', 'Working Paper'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('under_review', 'Under Review'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    # Basic Information
    title = models.CharField(max_length=300)
    abstract = models.TextField(help_text="Abstract or summary of the publication")
    publication_type = models.CharField(max_length=20, choices=PUBLICATION_TYPES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')

    # Authors and Contributors
    authors = models.ManyToManyField(User, through='AuthorContribution', related_name='publications')
    corresponding_author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                           related_name='corresponding_publications')

    # Publication Details
    journal_name = models.CharField(max_length=200, blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    volume = models.CharField(max_length=20, blank=True)
    issue = models.CharField(max_length=20, blank=True)
    pages = models.CharField(max_length=20, blank=True, help_text="e.g., 123-145")

    # Identifiers
    doi = models.CharField(max_length=200, blank=True, verbose_name="DOI")
    isbn = models.CharField(max_length=20, blank=True, verbose_name="ISBN")
    issn = models.CharField(max_length=20, blank=True, verbose_name="ISSN")
    arxiv_id = models.CharField(max_length=50, blank=True, verbose_name="arXiv ID")

    # Files and Links
    pdf_file = CloudinaryField('publications', null=True, blank=True)
    external_url = models.URLField(blank=True, help_text="External publication URL")

    # Categorization
    category = models.ForeignKey(ResearchCategory, on_delete=models.SET_NULL, null=True, blank=True)
    tags = TaggableManager(blank=True)
    keywords = models.CharField(max_length=500, blank=True, help_text="Comma-separated keywords")

    # Metrics
    download_count = models.PositiveIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    citation_count = models.PositiveIntegerField(default=0)

    # SEO and Display
    featured = models.BooleanField(default=False)
    cover_image = CloudinaryField('publication_covers', null=True, blank=True)

    class Meta:
        ordering = ['-publication_date', '-created_at']
        verbose_name = "Publication"
        verbose_name_plural = "Publications"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('publication-detail', kwargs={'pk': self.pk})

    @property
    def author_names(self):
        return [contrib.author.get_full_name() or contrib.author.username 
                for contrib in self.authorcontribution_set.all().order_by('order')]

    @property
    def citation_apa(self):
        """Generate APA citation"""
        authors = ", ".join(self.author_names[:3])  # First 3 authors
        if len(self.author_names) > 3:
            authors += " et al."

        citation = f"{authors} ({self.publication_date.year if self.publication_date else 'n.d.'}). {self.title}."

        if self.journal_name:
            citation += f" {self.journal_name}"
            if self.volume:
                citation += f", {self.volume}"
                if self.issue:
                    citation += f"({self.issue})"
            if self.pages:
                citation += f", {self.pages}"

        citation += "."

        if self.doi:
            citation += f" https://doi.org/{self.doi}"
        elif self.external_url:
            citation += f" {self.external_url}"

        return citation

    @property
    def citation_mla(self):
        """Generate MLA citation"""
        if not self.author_names:
            return f'"{self.title}." {self.publication_date.year if self.publication_date else "n.d."}.'

        first_author = self.author_names[0]
        # Reverse name for MLA (Last, First)
        if " " in first_author:
            names = first_author.split()
            first_author = f"{names[-1]}, {' '.join(names[:-1])}"

        citation = f'{first_author}. "{self.title}."'

        if self.journal_name:
            citation += f" {self.journal_name}"
            if self.volume:
                citation += f", vol. {self.volume}"
                if self.issue:
                    citation += f", no. {self.issue}"
            citation += f", {self.publication_date.year if self.publication_date else 'n.d.'}"
            if self.pages:
                citation += f", pp. {self.pages}"

        citation += "."

        if self.external_url:
            citation += f" {self.external_url}"

        return citation

class AuthorContribution(TimeStampedModel):
    """Through model for author contributions"""
    ROLE_CHOICES = [
        ('lead', 'Lead Author'),
        ('co_lead', 'Co-Lead Author'),
        ('contributor', 'Contributor'),
        ('reviewer', 'Reviewer'),
        ('editor', 'Editor'),
    ]

    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='contributor')
    contribution_description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0, help_text="Author order in publication")

    class Meta:
        ordering = ['order']
        unique_together = ['publication', 'author']
        verbose_name = "Author Contribution"
        verbose_name_plural = "Author Contributions"

    def __str__(self):
        return f"{self.author.get_full_name() or self.author.username} - {self.publication.title}"

class ResearchProject(TimeStampedModel):
    """Research projects and ongoing work"""
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField()
    objectives = models.TextField(help_text="Project objectives and goals")
    methodology = models.TextField(blank=True)

    # Timeline and Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    expected_completion = models.DateField(null=True, blank=True)

    # Team and Resources
    principal_investigator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                             related_name='led_projects')
    team_members = models.ManyToManyField(User, blank=True, related_name='research_projects')
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    funding_source = models.CharField(max_length=200, blank=True)

    # Categorization
    category = models.ForeignKey(ResearchCategory, on_delete=models.SET_NULL, null=True, blank=True)
    tags = TaggableManager(blank=True)

    # Outcomes
    publications = models.ManyToManyField(Publication, blank=True, related_name='projects')
    deliverables = models.TextField(blank=True, help_text="Expected or achieved deliverables")
    impact_metrics = models.JSONField(default=dict)

    # Files
    proposal_document = CloudinaryField('project_proposals', null=True, blank=True)
    final_report = CloudinaryField('project_reports', null=True, blank=True)

    class Meta:
        ordering = ['-start_date', '-created_at']
        verbose_name = "Research Project"
        verbose_name_plural = "Research Projects"

    def __str__(self):
        return self.title

    @property
    def is_ongoing(self):
        return self.status in ['planning', 'active']

    @property
    def completion_percentage(self):
        """Calculate completion percentage based on dates"""
        if not self.start_date or not self.expected_completion:
            return 0

        from django.utils import timezone
        today = timezone.now().date()

        if today < self.start_date:
            return 0
        elif today >= self.expected_completion:
            return 100
        else:
            total_days = (self.expected_completion - self.start_date).days
            elapsed_days = (today - self.start_date).days
            return min(100, int((elapsed_days / total_days) * 100))

class GoogleScholarSearch(TimeStampedModel):
    """Saved Google Scholar searches for research integration"""
    query = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    last_searched = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    auto_update = models.BooleanField(default=False)

    # Search parameters
    author_filter = models.CharField(max_length=200, blank=True)
    year_from = models.IntegerField(null=True, blank=True)
    year_to = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-last_searched']
        verbose_name = "Google Scholar Search"
        verbose_name_plural = "Google Scholar Searches"

    def __str__(self):
        return self.query

class Citation(TimeStampedModel):
    """Citations of our publications by other works"""
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='citations')
    citing_title = models.CharField(max_length=300)
    citing_authors = models.CharField(max_length=500)
    citing_publication = models.CharField(max_length=200, blank=True)
    citing_year = models.IntegerField(null=True, blank=True)
    citing_url = models.URLField(blank=True)

    # Auto-detected info
    google_scholar_id = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-citing_year', '-created_at']
        unique_together = ['publication', 'google_scholar_id']

    def __str__(self):
        return f"Citation of '{self.publication.title}' by {self.citing_authors}"
