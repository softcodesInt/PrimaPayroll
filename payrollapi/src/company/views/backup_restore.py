from time import time
import os

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.core.management import call_command
from django.conf import settings
from django.http import HttpResponse, Http404
from django.core.files.storage import FileSystemStorage


class BackupRestoreView(GenericAPIView):
    serializer_class = None
    authentication_classes = ()
    permission_classes = ()

    def download(self, request, path):
        file_path = os.path.join(settings.BASE_DIR, path)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read())
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response
        raise Http404

    def get(self, request):
        output_name = time()
        # call_command('dbbackup', '--encrypt', f'-o{output_name}.psql.gpg')
        call_command('dbbackup', f'-o{output_name}.psql')
        return self.download(request, f'{output_name}.psql')

    def post(self, request):
        restore_file = request.FILES['restore_file']
        fs = FileSystemStorage()
        fs_file = fs.save(restore_file.name, restore_file)
        uploaded_path = fs.path(fs_file)

        #call_command('dbrestore', '--decrypt', '-ppassphrase', f'-i{restore_file.name}', f'-I{uploaded_path}', '--noinput')
        call_command('dbrestore', f'-i{restore_file.name}', f'-I{uploaded_path}', '--noinput')
        return Response({})
