from django.contrib import admin
from .models import Sections, Subjects, InstructionMediums, Instructors, Courses, Terms

# Register your models here.


class SectionsAdmin(admin.ModelAdmin):
    list_display = ('crn', 'name', 'instructor', 'course',
                    'is_active', 'is_lab', 'medium')
    raw_id_fields = ['instructor', 'course']
    search_fields = ['crn', 'instructor__name']
    search_help_text = 'Search with CRN or instructor name.'
    sortable_by = ['crn', 'name', 'is_active', 'is_lab']
    ordering = ('-crn',)
    list_per_page = 10
    save_on_top = True
    save_as = True
    readonly_fields = ['get_readonly_fields']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['crn']
        else:
            return []


admin.site.register(Sections, SectionsAdmin)


class SubjectsAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    search_help_text = 'Search with name.'
    sortable_by = ['code', 'name']
    ordering = ('code',)
    save_on_top = True
    readonly_fields = ['get_readonly_fields']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['code']
        else:
            return []


admin.site.register(Subjects, SubjectsAdmin)

admin.site.register(InstructionMediums)


class InstructorsAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']
    search_help_text = 'Search with instructor name.'
    sortable_by = ['name']
    ordering = ('name',)
    list_per_page = 300
    save_on_top = True
    readonly_fields = ['get_readonly_fields']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['name']
        else:
            return []


admin.site.register(Instructors, InstructorsAdmin)


class CoursesAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'name', 'credits')
    search_fields = ['id', 'name', 'subject__code']
    search_help_text = 'Search with id, name or code.'
    sortable_by = ['id', 'name']
    ordering = ('id', 'name',)
    list_per_page = 10
    save_on_top = True
    readonly_fields = ['get_readonly_fields']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['id']
        else:
            return []


admin.site.register(Courses, CoursesAdmin)


admin.site.register(Terms)
