from django.contrib import admin
from .models import Schedules, Sections, Subjects, InstructionMediums, Instructors, Courses, Locations, Terms

# Register your models here.

class SchedulesAdmin(admin.ModelAdmin):
    list_display = ('id','sch_crn','weekday','is_weekly','date_start','date_end','time_start','time_end')
    raw_id_fields = ['crn','location']
    search_fields = ['id','crn__crn']
    search_help_text = 'Search with id or CRN.'
    sortable_by = ['get_crn']
    list_per_page = 10
    ordering = ('-crn__crn',)
    save_on_top = True
    save_as = True
    readonly_fields = ['id']

    def sch_crn(self,obj):
        return obj.crn.crn

admin.site.register(Schedules, SchedulesAdmin)

class SectionsAdmin(admin.ModelAdmin):
    list_display = ('crn','name','instructor','course','is_active','is_lab', 'medium')
    raw_id_fields = ['instructor','course']
    search_fields = ['crn','instructor__name']
    search_help_text = 'Search with CRN or instructor name.'
    sortable_by = ['crn','name','is_active','is_lab']
    ordering = ('-crn',)
    list_per_page = 10
    save_on_top = True
    save_as = True
    readonly_fields = ['crn']

admin.site.register(Sections, SectionsAdmin)


class SubjectsAdmin(admin.ModelAdmin):
    list_display = ('id','name')
    search_fields = ['name']
    search_help_text = 'Search with name.'
    sortable_by = ['id','name']
    ordering = ('id',)
    save_on_top = True
    readonly_fields = ['id']

admin.site.register(Subjects, SubjectsAdmin)

admin.site.register(InstructionMediums)

class InstructorsAdmin(admin.ModelAdmin):
    list_display = ('id','name')
    search_fields = ['id','name']
    search_help_text = 'Search with instructor name.'
    sortable_by = ['id','name']
    ordering = ('name',)
    list_per_page = 300
    save_on_top = True
    readonly_fields = ['id']

admin.site.register(Instructors, InstructorsAdmin)

class CoursesAdmin(admin.ModelAdmin):
    list_display = ('id','code','subject','name','credits')
    search_fields = ['id','name','code','subject__id']
    search_help_text = 'Search with id, name or code.'
    sortable_by = ['id','name','code']
    ordering = ('subject','code','name',)
    list_per_page = 10
    save_on_top = True
    readonly_fields = ['id']

admin.site.register(Courses, CoursesAdmin)

class LocationsAdmin(admin.ModelAdmin):
    list_display = ('id','campus','building','room')
    search_fields = ['id','campus','room']
    search_help_text = 'Search with campus or room.'
    sortable_by = ['id','campus','building','room']
    ordering = ('campus','building','room',)
    list_per_page = 300
    save_on_top = True
    readonly_fields = ['id']

admin.site.register(Locations, LocationsAdmin)
admin.site.register(Terms)