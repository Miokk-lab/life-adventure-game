# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
from unittest.mock import MagicMock

# Force integration test mode env var
os.environ["INTEGRATION_TEST"] = "TRUE"

# Mock Cloud Resource Manager to prevent permission errors when querying project metadata
try:
    from google.cloud.aiplatform.utils import resource_manager_utils

    resource_manager_utils.get_project_id = MagicMock(return_value="mock-project-id")
except Exception:
    pass

# Mock google cloud logging client to avoid network activity during local tests
try:
    from google.cloud import logging as google_cloud_logging

    # Keep a dummy logger mock
    mock_client = MagicMock()
    google_cloud_logging.Client = MagicMock(return_value=mock_client)
except Exception:
    pass
